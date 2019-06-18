import mongoose from 'mongoose'

export const User = mongoose.model('User', { firstName: String, lastName: String, email: String, password: String, userType: String });