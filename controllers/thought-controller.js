const { Thought, User } = require("../models");

const thoughtController = {
	async getAllThoughts(req, res) {
		try {
			const thoughtData = Thought.find({}).select("-__v");

			res.status(200).json(thoughtData);
		} catch (err) {
			res.status(400).json(err);
		}
	},
	async getThoughtById(req, res) {
		try {
			const thoughtData = Thought.findOne({ _id: req.params.thoughtId });

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
			const thoughtData = Thought.create(req.body);
			const userData = User.findOneAndUpdate(
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
			const thoughtData = Thought.findOneAndUpdate({
				_id: req.params.thoughtId,
			});

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
			const thoughtData = Thought.findOneAndDelete({
				_id: req.params.thoughtId,
			});

			if (!thoughtData) {
				return res.status(404).json({ message: "Thought cannot be found." });
			}

			const userData = User.findOneAndDelete(
				{ _id: req.params.thoughtId },
				{ $pull: { thought: req.params.thoughtId } },
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
			const reactionData = Thought.findOneAndUpdate(
				{ _id: req.body.thoughtId },
				{ $addToSet: { reaction: req.body } }
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
	async deleteReaction(req, res) {
		try {
			const reactionData = Thought.findOneAndDelete(
				{ _id: req.params.thoughtId },
				{ $pull: { reactions: req.params.reactionId } }
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
