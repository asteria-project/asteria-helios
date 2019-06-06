import express from 'express';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { TemplateRegistry } from '../../service/data/TemplateRegistry';
import { AsteriaException, HttpStatusCode } from 'asteria-gaia';
import { HeliosTemplate } from 'asteria-eos';
import { HeliosTemplateBuilder } from '../../util/builder/HeliosTemplateBuilder';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';

/**
 * The <code>TemplatesConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to declare 
 * the Helios <code>/templates</code> route.
 */
export class TemplatesConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * Create a new <code>TemplatesConfigurator</code> instance.
     */
    constructor() {
        super('templates');
    }
    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        const expressRouter: express.Router = router.getRouter();
        expressRouter.get(HeliosRoute.TEMPLATES, (req: express.Request, res: express.Response) => {
            HeliosRouterLogUtils.logRoute(req, 'GET /templates');
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            registry.getAll((err:AsteriaException,  templates: Array<HeliosTemplate>)=> {
                if (err) {
                    HeliosRouterLogUtils.logRouteError(req, 'GET /templates', err.toString());
                    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
                } else {
                    res.send(templates);
                }
            });
            
        });
        expressRouter.post(HeliosRoute.TEMPLATES, (req: express.Request, res: express.Response) => {
            HeliosRouterLogUtils.logRoute(req, 'POST /templates');
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            const template: HeliosTemplate = HeliosTemplateBuilder.buildFromBody(req.body);
            registry.add(template, (err: AsteriaException)=> {
                if (err) {
                    HeliosRouterLogUtils.logRouteError(req, 'POST /templates', err.toString());
                    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
                } else {
                    res.send(template.id);
                }
            });
        });
        expressRouter.get(HeliosRoute.TEMPLATES_ID, (req: express.Request, res: express.Response) => {
            const id: string = req.params.id;
            const templateRef: string = 'GET /templates/' + id;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            registry.get(id, (err: AsteriaException, template: HeliosTemplate)=> {
                if (err) {
                    HeliosRouterLogUtils.logRouteError(req, templateRef, err.toString());
                    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
                } else {
                    if (template) {
                        res.status(HttpStatusCode.CREATED).send(template);
                    } else {
                        res.sendStatus(HttpStatusCode.NOT_FOUND);
                    }
                }
            });
        });
        // TODO: code improvement
        expressRouter.put(HeliosRoute.TEMPLATES_ID, (req: express.Request, res: express.Response) => {
            const id: string = req.params.id;
            const templateRef: string = 'GET /templates/' + id;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            const updatedTemplate: HeliosTemplate = JSON.parse(req.body);
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            registry.get(id, (err: AsteriaException, template: HeliosTemplate)=> {
                if (err) {
                    HeliosRouterLogUtils.logRouteError(req, templateRef, err.toString());
                    res.sendStatus(500);
                } else {
                    if (template) {
                        template.description = updatedTemplate.description;
                        template.processes = updatedTemplate.processes;
                        registry.add(template, (err: AsteriaException)=>{
                            if (err) {
                                HeliosRouterLogUtils.logRouteError(req, templateRef, err.toString());
                                res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
                            } else {
                                res.sendStatus(HttpStatusCode.NO_CONTENT);
                            }
                        });
                    } else {
                        res.sendStatus(HttpStatusCode.NOT_FOUND);
                    }
                }
            });
        });
        this.routeAdded(HeliosRoute.TEMPLATES);
    }
}