const Group = require("../models/Group");
const mongoose = require("mongoose");

//SECTION: get all groups

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//SECTION: get group

const getGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ msg: "Invalid group ID format" });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    res.status(200).json({ group });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//SECTION: create group

const createGroup = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "Group name is required" });
  }

  try {
    const newGroup = new Group({ name });
    await newGroup.save();

    res.status(201).json({ group: newGroup });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { getGroups, getGroup, createGroup };
