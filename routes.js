const express = require("express");
const router = express.Router();

const taskController = require("./controllers/taskController");
const groupController = require("./controllers/groupController");

//TODO complete user route
//SECTION: user route

//SECTION: group route

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Bad request
 */
router.post("/groups", groupController.createGroup);

/**
 * @swagger
 * /groups/{groupId}:
 *   get:
 *     summary: Get a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group retrieved successfully
 *       400:
 *         description: Invalid group ID format
 *       404:
 *         description: Group not found
 */
router.get("/groups/:groupId", groupController.getGroup);

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Groups retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/groups", groupController.getGroups);

//SECTION: task route

/**
 * @swagger
 * /groups/{groupId}/tasks:
 *   post:
 *     summary: Create a new task in a group
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Group not found
 */
router.post("/groups/:groupId/tasks", taskController.createTask);

/**
 * @swagger
 * /groups/{groupId}/tasks/{taskId}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       400:
 *         description: Invalid task ID format
 *       404:
 *         description: Task not found
 */
router.get("/groups/:groupId/tasks/:taskId", taskController.getTask);

/**
 * @swagger
 * /groups/{groupId}/tasks:
 *   get:
 *     summary: Get all tasks in a group
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       400:
 *         description: Invalid group ID format
 *       404:
 *         description: No tasks found for this group
 */
router.get("/groups/:groupId/tasks", taskController.getTasks);

/**
 * @swagger
 * /groups/{groupId}/tasks/{taskId}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Task not found
 */
router.put("/groups/:groupId/tasks/:taskId", taskController.updateTask);

/**
 * @swagger
 * /groups/{groupId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete("/groups/:groupId/tasks/:taskId", taskController.deleteTask);

module.exports = router;
