/**
 * @file
 * This file handles the Workflow scenarios.
 * Scenarios implemented:
 * - Workflow definition creation.
 * - Workflow definition publishing.
 * - Workflow definition triggering, which create workflow instance.
 * - Workflow instance cancellation.
 * - Workflow instance fetching.
 */

const path = require('path');
const validator = require('validator'); // Package to prevent XSS. This is not express-validator
const docusign = require('docusign-esign');
const config = require('../config');
const WorkflowsService = require('../services/workflowsService');
const createPrefixedLogger = require('../utils/logger');
const { getParameterValueFromUrl } = require('../utils/utils');
const { TEMPLATE_TYPE } = require('../constants');

const oAuth = docusign.ApiClient.OAuth;
const restApi = docusign.ApiClient.RestApi;

class WorkflowsController {
  // For production environment, change "DEMO" to "PRODUCTION"
  static basePath = restApi.BasePath.DEMO; // https://demo.docusign.net/restapi
  static oAuthBasePath = oAuth.BasePath.DEMO; // account-d.docusign.com
  static templatesPath = path.join(path.resolve(), 'assets/templates');
  static logger = createPrefixedLogger(WorkflowsController.name);

  /**
   * Creates workflow instance and sends a response.
   */
  static createWorkflow = async (req, res) => {
    try {
      const args = {
        basePath: this.basePath,
        accessToken: req.user.accessToken,
        accountId: req.session.accountId,
        templateType: req?.body?.templateType,
      };
      let templateResponse = await WorkflowsService.getTemplate(args);

      if (!templateResponse.templateId) {
        templateResponse = await WorkflowsService.createTemplate(args);
      }

      const workflow = await WorkflowsService.createWorkflow({
        ...args,
        templateId: templateResponse.templateId,
        basePath: config.maestroApiUrl,
      });

      res.json({ workflowDefinitionId: workflow.workflowDefinitionId });
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  /**
   * Cancels workflow instance and sends a response.
   */
  static cancelWorkflow = async (req, res) => {
    try {
      const result = await WorkflowsService.cancelWorkflowInstance({
        instanceId: req?.params?.instanceId,
        accessToken: req?.user?.accessToken || req?.session?.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
      });
      res.status(200).send(result);
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  /**
   * Publish workflow by id.
   */
  static publishWorkflow = async (req, res) => {
    const workflowId = req?.body?.workflowId;

    try {
      let result = await WorkflowsService.publishWorkflow(
        {
          basePath: config.maestroApiUrl,
          accessToken: req.user.accessToken,
          accountId: req.session.accountId,
        },
        workflowId
      );

      res.status(200).send(result);
    } catch (error) {
      if (error?.errorMessage === 'Consent required') {
        res.status(210).send(error.consentUrl);
        return;
      }

      this.handleErrorResponse(error, res);
    }
  };

  /**
   * Gets workflow definitions and returns it.
   */
  static getWorkflowDefinitions = async (req, res) => {
    try {
      const results = await WorkflowsService.getWorkflowDefinitions({
        accessToken: req?.user?.accessToken || req?.session?.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
      });
      res.status(200).send(results);
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  /**
   * Gets workflow instance and returns it.
   */
  static getWorkflowInstance = async (req, res) => {
    try {
      const result = await WorkflowsService.getWorkflowInstance({
        instanceId: req?.params?.instanceId,
        definitionId: req?.params?.definitionId,
        accessToken: req?.user?.accessToken || req?.session?.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
      });
      res.status(200).send(result);
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  /**
   * Gets workflow instances and returns it.
   */
  static getWorkflowInstances = async (req, res) => {
    try {
      const results = await WorkflowsService.getWorkflowInstances({
        definitionId: req.params.definitionId,
        accessToken: req?.user?.accessToken || req?.session?.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
      });

      res.status(200).send(results);
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  /**
   * Triggers a workflow instance and sends a response.
   */
  static triggerWorkflow = async (req, res) => {
    const { body } = req;

    const mainArgs = {
      templateType: req.query.type,
      workflowId: req.params.definitionId,
      accessToken: req?.user?.accessToken || req?.session?.accessToken,
      basePath: config.maestroApiUrl,
      accountId: req.session.accountId,
      mtid: undefined,
      mtsec: undefined,
    };

    const bodyArgs = {};
    if (req.query.type === TEMPLATE_TYPE.I9) {
      bodyArgs.preparerName = validator.escape(body?.preparerName);
      bodyArgs.preparerEmail = validator.escape(body?.preparerEmail);
      bodyArgs.employeeName = validator.escape(body?.employeeName);
      bodyArgs.employeeEmail = validator.escape(body?.employeeEmail);
      bodyArgs.hrApproverName = validator.escape(body?.hrApproverName);
      bodyArgs.hrApproverEmail = validator.escape(body?.hrApproverEmail);
    }
    if (req.query.type === TEMPLATE_TYPE.OFFER) {
      bodyArgs.hrManagerName = validator.escape(body?.hrManagerName);
      bodyArgs.hrManagerEmail = validator.escape(body?.hrManagerEmail);
      bodyArgs.Company = validator.escape(body?.Company);
    }
    if (req.query.type === TEMPLATE_TYPE.NDA) {
      bodyArgs.hrManagerName = validator.escape(body?.hrManagerName);
      bodyArgs.hrManagerEmail = validator.escape(body?.hrManagerEmail);
    }

    const args = { ...mainArgs, ...bodyArgs };

    try {
      const workflow = await WorkflowsService.getWorkflowDefinition(args);
      args.mtid = getParameterValueFromUrl(workflow.triggerUrl, 'mtid');
      args.mtsec = getParameterValueFromUrl(workflow.triggerUrl, 'mtsec');

      const result = await WorkflowsService.triggerWorkflowInstance(args);
      res.status(200).send(result);
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  /**
   * Download workflow template from assets/[name].json.
   */
  static downloadWorkflowTemplate = async (req, res) => {
    const templateName = req.params.templateName;
    const templatePath = path.resolve(this.templatesPath, templateName);
    res.download(templatePath);
  };

  static handleErrorResponse(error, res) {
    this.logger.error(`handleErrorResponse: ${error}`);

    const errorCode = error?.response?.statusCode;
    const errorMessage = error?.response?.body?.message;

    // use custom error message if Maestro is not enabled for the account
    if (errorCode === 403) {
      res.status(403).send({ err: error, errorMessage, errorInfo: 'Contact Support to enable this Feature' });
      return;
    }

    res.status(errorCode).send({ err: error, errorMessage, errorInfo: null });
  }
}

module.exports = WorkflowsController;
