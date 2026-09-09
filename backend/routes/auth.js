import express from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { supabase } from '../lib/supabase.js'
import { authMiddleware, optionalAuth } from '../middleware/auth.js'
import { catchAsync, AppError } from '../middleware/errorHandler.js'

const router = express.Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Valid Indian phone number required'),
  validate
], catchAsync(async (req, res) => {
  const { name, email, password, phone } = req.body

  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    throw new AppError('Email already registered', 409)
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, phone }
  })

  if (authError) throw new AppError(authError.message, 400)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authUser.user.id,
      email,
      name,
      phone,
      role: 'user',
      avatar_url: null
    })
    .select()
    .single()

  if (profileError) throw new AppError(profileError.message, 400)

  const token = jwt.sign(
    { userId: authUser.user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: profile
  })
}))

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], catchAsync(async (req, res) => {
  const { email, password } = req.body

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (authError) {
    throw new AppError('Invalid email or password', 401)
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (profileError) throw new AppError(profileError.message, 400)

  const token = jwt.sign(
    { userId: authData.user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )

  res.json({
    message: 'Login successful',
    token,
    user: profile
  })
}))

router.post('/logout', authMiddleware, catchAsync(async (req, res) => {
  await supabase.auth.signOut()
  res.json({ message: 'Logged out successfully' })
}))

router.get('/me', authMiddleware, catchAsync(async (req, res) => {
  res.json({ user: req.user })
}))

router.put('/profile', authMiddleware, [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().isMobilePhone('en-IN'),
  validate
], catchAsync(async (req, res) => {
  const { name, phone, bio } = req.body
  const updates = {}
  if (name) updates.name = name
  if (phone) updates.phone = phone
  if (bio) updates.bio = bio

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', req.user.id)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.json({ user: profile })
}))

router.put('/password', authMiddleware, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  validate
], catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const { data: authUser, error: authError } = await supabase.auth.getUser()
  if (authError) throw new AppError('Authentication failed', 401)

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (updateError) throw new AppError(updateError.message, 400)

  res.json({ message: 'Password updated successfully' })
}))

export default router