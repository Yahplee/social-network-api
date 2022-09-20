const { Thought, User } = require("../models");

const thoughtController = {
	async getAllThoughts(req, res) {
		try {
			const thoughtData = await Thought.find().select("-__v");

			res.status(200).json(thoughtData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async getThoughtById(req, res) {
		try {
			const thoughtData = await Thought.findOne({ _id: req.params.thoughtId });

			if (!thoughtData) {
				return res.status(404).json({ message: "Thought cannot be found." });
			}

			res.status(200).json(thoughtData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async createThought(req, res) {
		try {
			const thoughtData = await Thought.create(req.body);
			const userData = await User.findOneAndUpdate(
				{ _id: req.body.userId },
				{ $push: { thoughts: thoughtData._id } },
				{ new: true }
			);

			res.status(200).json({ message: "Message created!" });
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async updateThought(req, res) {
		try {
			const thoughtData = await Thought.findOneAndUpdate(
				{
					_id: req.params.thoughtId,
				},
				{
					$set: req.body,
				},
				{
					runValidators: true,
					new: true,
				}
			);

			if (!thoughtData) {
				return res.status(404).json({ message: "Thought cannot be found." });
			}

			res.status(200).json(thoughtData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async deleteThought(req, res) {
		try {
			const thoughtData = await Thought.findOneAndDelete({
				_id: req.params.thoughtId,
			});

			if (!thoughtData) {
				return res.status(404).json({ message: "Thought cannot be found." });
			}

			const userData = await User.findOneAndUpdate(
				{ thoughts: req.params.thoughtId },
				{ $pull: { thoughts: req.params.thoughtId } },
				{ new: true }
			);

			if (!userData) {
				return res.status(404).json({
					message: "Cannot find user associated with the deleted thought.",
				});
			}

			res.status(200).json({ message: "Thought deleted successfully." });
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async createReaction(req, res) {
		try {
			const reactionData = await Thought.findOneAndUpdate(
				{ _id: req.params.thoughtId },
				{ $addToSet: { reactions: req.body } }
			);

			if (!reactionData) {
				return res.status(404).json({
					message: "Reaction cannot be created.",
				});
			}

			res.status(200).json(reactionData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async deleteReaction(req, res) {
		try {
			const reactionData = await Thought.findOneAndUpdate(
				{ _id: req.params.thoughtId },
				{ $pull: { reactions: { reactionId: req.params.reactionId } } }
			);

			if (!reactionData) {
				return res.status(404).json({
					message: "Reaction cannot be found.",
				});
			}

			res.status(200).json(reactionData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
};

module.exports = thoughtController;
