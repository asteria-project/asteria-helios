import { Request, Response } from 'express';
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
import { HeaderUtils } from '../../util/net/HeaderUtils';

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
        this.createGetTemplatesRoute(router, context);
        this.createGetTemplateRoute(router, context);
        this.createPostTemplateRoute(router, context);
        this.createPutTemplateRoute(router, context);
        this.routeAdded(HeliosRoute.TEMPLATES);
    }

    /**
     * Create the route for the <code>/templates</code> path and the HTTP <code>GET</code> method.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    private createGetTemplatesRoute(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'GET /templates';
        router.getRouter().get(HeliosRoute.TEMPLATES, (req: Request, res: Response) => {
            HeliosRouterLogUtils.logRoute(req, pathPattern);
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            registry.getAll((err:AsteriaException,  templates: Array<HeliosTemplate>)=> {
                if (err) {
                    HeliosRouterLogUtils.logRouteError(req, pathPattern, err.toString());
                    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
                } else {
                    res.send(templates);
                }
            });
        });
    }

    /**
     * Create the route for the <code>/templates/:id</code> path and the HTTP <code>GET</code> method.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    private createGetTemplateRoute(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'GET /templates/';
        router.getRouter().get(HeliosRoute.TEMPLATES_ID, (req: Request, res: Response) => {
            const id: string = req.params.id;
            const templateRef: string = pathPattern + id;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            registry.get(id, (err: AsteriaException, template: HeliosTemplate)=> {
                if (err) {
                    HeliosRouterLogUtils.logRouteError(req, templateRef, err.toString());
                    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
                } else {
                    if (template) {
                        res.send(template);
                    } else {
                        res.sendStatus(HttpStatusCode.NOT_FOUND);
                    }
                }
            });
        });
    }
    
    /**
     * Create the route for the <code>/templates</code> path and the HTTP <code>POST</code> method.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    private createPostTemplateRoute(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'POST /templates';
        router.getRouter().post(HeliosRoute.TEMPLATES, (req: Request, res: Response) => {
            HeliosRouterLogUtils.logRoute(req, pathPattern);
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            const template: HeliosTemplate = HeliosTemplateBuilder.buildFromBody(req.body);
            registry.add(template, (err: AsteriaException)=> {
                if (err) {
                    HeliosRouterLogUtils.logRouteError(req, pathPattern, err.toString());
                    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
                } else {
                    const id: string = template.id;
                    HeaderUtils.setLocation(context, res, `${HeliosRoute.TEMPLATES}/${id}`);
                    res.status(HttpStatusCode.CREATED).send(id);
                }
            });
        });
    }

    /**
     * Create the route for the <code>/templates</code> path and the HTTP <code>PUT</code> method.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    private createPutTemplateRoute(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'PUT /templates/';
        // TODO: code improvement
        router.getRouter().put(HeliosRoute.TEMPLATES_ID, (req: Request, res: Response) => {
            const id: string = req.params.id;
            const templateRef: string = pathPattern + id;
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
    }
}