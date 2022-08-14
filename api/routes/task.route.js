const taskService = require('../services/task.service');
var schema = require('../schemas/task.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/tasks')
    .get(getAllTasks)
    .post(addTask);
  router.route('/tasks/search')
    .post(searchTasks);
  router.route('/tasks/count')
    .get(getAllTasksCount);
  router.route('/tasks/exist')
    .get(isExist);
  router.route('/tasks/completed')
    .get(getCompletedTasksCount);
  router.route('/tasks/widget')
    .get(getTaskWidgetData)
  router.route('/tasks/:id')
    .get(getTaskById)
    .delete(deleteTask)
    .put(updateTask);
}

/**
 * Get all a tasks api
 * @route GET /api/tasks
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllTasks(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      taskService.getTasksByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      taskService.getTasksByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    taskService.getAllTasks().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * @typedef SearchCriteria
 * @property {string} pageSize.required
 * @property {string} pageNo.required 
 * @property {string} query.required 
 */
/**
 * Search tasks api
 * @route POST /api/tasks/search
 * @group tasks - Operations about tasks
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function searchTasks(req, res, next) {
  let searchCriteria = req.body;
  taskService.searchTasks(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get tasks by id api
 * @route GET /api/tasks/:id
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function getTaskById(req, res, next) {

  let taskId = req.params.id;

  console.log("id" + taskId);
  var json_format = iValidator.json_schema(schema.getSchema, taskId, "task");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  taskService.getTaskById(taskId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.TASK_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add tasks api
 * @route POST /api/tasks
 * @group tasks - Operations about tasks
 * @param {object} taskData.body.required - tasks details
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function addTask(req, res, next) {
  var taskData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, taskData, "task");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  taskService.getTaskByTaskName(taskData.name).then((data) => {
    if (data != undefined) {
      return next(errorMethods.sendBadRequest(errorCode.TASK_ALREADY_EXIST));
    } else {
      taskService.addTask(taskData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });

}

/**
 * update tasks by id api
 * @route PUT /api/tasks
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function updateTask(req, res, next) {
  var taskData = req.body;
  var id = req.params.id;
  taskService.getTaskById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.TASK_NOT_EXIST));
    } else {
      taskService.updateTask(id, taskData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * delete tasks by id api
 * @route DELETE /api/tasks/:id
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function deleteTask(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  taskService.getTaskById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.TASK_NOT_EXIST));
    } else {
      taskService.deleteTask(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get tasks count api
 * @route GET /api/tasks/count
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllTasksCount(req, res, next) {
  var filter = req.query.filter;
  taskService.getAllTasksCount(filter).then((data) => {
    if (data == undefined) {
      return next(errorMethods.sendBadRequest(errorCode.TASK_NOT_EXIST));
    }
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get tasks count api
 * @route GET /api/tasks/completed
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function getCompletedTasksCount(req, res, next) {
  var filter = req.query.filter;
  taskService.getCompletedTasksCount(filter).then((data) => {
    if (data == undefined) {
      return next(errorMethods.sendBadRequest(errorCode.TASK_NOT_EXIST));
    }
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}



/**
 * Is tasks exist api
 * @route GET /api/tasks/exist
 * @group tasks - Operations about tasks
 * @param {string} taskame.query.required - tasks name
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  /* let projectId = req.query.projectId
  let milestoneId = req.query.milestoneId */
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  /* taskService.getTaskByProject(projectId, milestoneId, name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  }); */
  taskService.getTaskByTaskName(name).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/******************************************************
 * @DESC       - API TO GET ALL TASKS WIDGET DATA
 * @ROUTE      - /api/tasks/widget
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - GET
 * @PARAMS     - widgetNo=1 TASK FOR WIDGET TO GET THE 
 ******************************************************/
async function getTaskWidgetData( req, res, next ){
  try{
    var widgetNo = req.query.widgetNo;
    var isOrganisation = req.query.isOrganisation;
    if( widgetNo === "1" ){
      let returnData = await taskService.getTodaysOpenTask( isOrganisation );
      return res.json( returnData );
    } else {
      next(errorMethods.sendBadRequest(errorCode.INVALID_DATA));
    }
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

module.exports.init = init;