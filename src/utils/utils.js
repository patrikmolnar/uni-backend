const User = require('../models/user')
const University = require('../models/university')

const formatDate = value => {
	return new Date(value).toLocaleString()
}

const includeNestedUniversity = value => {
	return {
		...value._doc,
		_id: value.id,
		university: university.bind(this, value._doc.university),
		createdAt: formatDate.bind(this, value._doc.createdAt),
		updatedAt: formatDate.bind(this, value._doc.createdAt)
	}
}

const users = async userIds => {
	try {
		const users = await User.find({ _id: { $in: userIds } })

		return users.map(user => {
			return { 
				...user._doc,
				 _id: user.id, 
				 university: university.bind(this, user._doc.university) 
			}
		})

	}
	catch(err){
		throw err;
	}
}

const university = async uniId => {
	try {
		const uni = await University.findById(uniId)
		
		return { 
			...uni._doc, 
			_id: uni.id, 
			users: users.bind(this, uni._doc.users) 
		}
	} 
	catch (err) {
		throw err;
	}
}

exports.formatDate = formatDate;
exports.users = users;
exports.university = university;
exports.includeNestedUniversity = includeNestedUniversity;