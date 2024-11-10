const Task = require("../models/Task");
const Group = require("../models/Group");
const mongoose = require("mongoose");

//SECTION: create task

const createTask = async (req, res) => {
  const { groupId } = req.params;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ msg: "Task description is required" });
  }

  try {
    const existingTask = await Task.findOne({ description, groupId });
    if (existingTask) {
      return res
        .status(400)
        .json({ msg: "Task description must be unique within the group" });
    }

    const task = await Task.create({ description, groupId });

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    group.tasks.push(task._id);
    await group.save();

    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//SECTION: get task

const getTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const task = await Task.findOne({ __id: taskId });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

//SECTION: get all tasks

const getTasks = async (req, res) => {
  const { groupId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ msg: "Invalid group ID format" });
  }

  try {
    const tasks = await Task.find({ groupId });

    if (tasks.length === 0) {
      return res.status(404).json({ msg: "No tasks found for this group" });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//SECTION: delete task

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOneAndDelete({ _id: taskId });
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskId}` });
    }

    const group = await Group.findOneAndUpdate(
      { _id: task.groupId },
      { $pull: { tasks: taskId } },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    res.status(200).json({ msg: "Task deleted successfully", task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//SECTION: update task

const updateTask = async (req, res) => {
  res.send("update task");
};

module.exports = { createTask, getTask, deleteTask, updateTask, getTasks };
