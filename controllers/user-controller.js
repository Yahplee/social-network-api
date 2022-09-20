const { User } = require("../models");

const userController = {
	async getAllUsers(req, res) {
		try {
			const userData = await User.find({}).select("-__v");

			res.status(200).json(userData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async getUsersById(req, res) {
		try {
			const userData = await User.findOne({ _id: req.params.userId })
				.select("-__v")
				.populate("thoughts");

			if (!userData) {
				return res.status(404).json({ message: "User cannot be found." });
			}

			res.status(200).json(userData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async createUser(req, res) {
		try {
			const userData = await User.create(req.body);

			res.status(200).json(userData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async updateUser(req, res) {
		try {
			const userData = await User.findOneAndUpdate({ _id: req.params.userId });

			if (!userData) {
				return res.status(404).json({ message: "User cannot be found." });
			}

			res.status(200).json(userData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async deleteUser(req, res) {
		try {
			const userData = await User.findOneAndDelete({ _id: req.params.userId });

			if (!userData) {
				return res.status(404).json({ message: "User cannot be found." });
			}

			res.status(200).json(userData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async addFriend(req, res) {
		try {
			const friendData = await User.findOneAndUpdate(
				{ _id: req.params.userId },
				{
					$addToSet: { friend: req.body },
				},
				{ new: true }
			);

			if (!friendData) {
				return res.status(404).json({ message: "User cannot be found." });
			}

			res.status(200).json(friendData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async deleteFried(req, res) {
		try {
			const friendData = await User.findOneAndDelete(
				{ _id: req.params.userId },
				{
					$pull: { friend: req.params.friendId },
				},
				{ new: true }
			);

			if (!friendData) {
				return res.status(404).json({ message: "User cannot be found." });
			}

			res.status(200).json(friendData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
};

modules.exports = userController;
