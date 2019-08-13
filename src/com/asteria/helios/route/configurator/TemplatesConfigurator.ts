import { Request, Response } from 'express';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { TemplateRegistry } from '../../service/data/TemplateRegistry';
import { AsteriaException } from 'asteria-gaia';
import { HeliosTemplate, HeliosData } from 'asteria-eos';
import { HeliosTemplateBuilder } from '../../util/builder/HeliosTemplateBuilder';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HeaderUtils } from '../../util/net/HeaderUtils';
import { TemplateErrorMediator } from '../error/TemplateErrorMediator';
import { HttpErrorUtils } from '../../util/error/HttpErrorUtils';
import { HeliosDataBuilder } from '../../util/builder/HeliosDataBuilder';
import { RsState, StateType, HttpMethod, TransitionConfig, RsMapTransition, HttpStatusCode, RsTransitionFromState } from 'jsax-rs';

/**
 * The <code>TemplatesConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to declare 
 * the Helios <code>/templates</code> route.
 */
export class TemplatesConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * Transition declaration of the "/workspace/controller/list" resource path.
     */
    @RsTransitionFromState('getTemplates')
    public readonly getTemplatesTransition: TransitionConfig;

    /**
     * The reference to the object that manages errors for this route configurator.
     */
    private readonly ERROR_MEDIATOR: TemplateErrorMediator = null;

    /**
     * Create a new <code>TemplatesConfigurator</code> instance.
     */
    constructor() {
        super('templates');
        this.ERROR_MEDIATOR = new TemplateErrorMediator();
    }
    
    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        this.getTemplates(router, context);
        this.getTemplate(router, context);
        this.createTemplate(router, context);
        this.updateTemplate(router, context);
        this.deleteTemplate(router, context);
        this.routeAdded(HeliosRoute.TEMPLATES);
    }

    /**
     * Create the route for the <code>/templates</code> resource path and the HTTP <code>GET</code> method.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/templates',
        type: StateType.COLLECTION,
        method: HttpMethod.GET
    })
    private getTemplates(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'GET /templates';
        const stateName: string = 'getTemplates';
        router.getRouter().get(HeliosRoute.TEMPLATES, (req: Request, res: Response) => {
            HeliosRouterLogUtils.logRoute(req, pathPattern);
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            registry.getAll((err: AsteriaException,  templates: Array<HeliosTemplate>)=> {
                if (err) {
                    HttpErrorUtils.processError(
                        req, res, pathPattern, this.ERROR_MEDIATOR.resolveTemplatesError, err
                    );
                } else {
                    const result: HeliosData<Array<HeliosTemplate>> =
                        HeliosDataBuilder.build<Array<HeliosTemplate>>(context.getId(), templates, stateName);
                    res.send(result);
                }
            });
        });
    }

    /**
     * Create the route for the <code>/templates/:id</code> resource path and the HTTP <code>GET</code> method.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/templates/:id',
        type: StateType.COLLECTION,
        method: HttpMethod.GET
    })
    @RsMapTransition('getTemplatesTransition')
    private getTemplate(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'GET /templates/';
        const stateName: string = 'getTemplate';
        router.getRouter().get(HeliosRoute.TEMPLATES_ID, (req: Request, res: Response) => {
            const id: string = req.params.id;
            const templateRef: string = pathPattern + id;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            registry.get(id, (err: AsteriaException, template: HeliosTemplate)=> {
                if (err) {
                    HttpErrorUtils.processError(
                        req, res, templateRef, this.ERROR_MEDIATOR.resolveTemplatesError, err
                    );
                } else {
                    if (template) {
                        const result: HeliosData<HeliosTemplate> = HeliosDataBuilder.build<HeliosTemplate>(
                            context.getId(), template, stateName, { id: id }
                        );
                        res.send(result);
                    } else {
                        res.sendStatus(HttpStatusCode.NOT_FOUND);
                    }
                }
            });
        });
    }
    
    /**
     * Create the route for the <code>/templates</code> resource path and the HTTP <code>POST</code> method.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/templates',
        type: StateType.COLLECTION,
        method: HttpMethod.POST
    })
    @RsMapTransition('getTemplatesTransition')
    private createTemplate(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'POST /templates';
        const stateName: string = 'createTemplate';
        router.getRouter().post(HeliosRoute.TEMPLATES, (req: Request, res: Response) => {
            HeliosRouterLogUtils.logRoute(req, pathPattern);
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            const template: HeliosTemplate = HeliosTemplateBuilder.buildFromBody(req.body);
            registry.add(template, (err: AsteriaException)=> {
                if (err) {
                    HttpErrorUtils.processError(
                        req, res, pathPattern, this.ERROR_MEDIATOR.resolveTemplatesError, err
                    );
                } else {
                    const id: string = template.id;
                    HeaderUtils.setLocation(context, res, `${HeliosRoute.TEMPLATES}/${id}`);
                    const result: HeliosData<string> = HeliosDataBuilder.build<string>(context.getId(), id, stateName);
                    res.status(HttpStatusCode.CREATED).send(result);
                }
            });
        });
    }

    /**
     * Create the route for the <code>/templates</code> resource path and the HTTP <code>PUT</code> method.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/templates',
        type: StateType.COLLECTION,
        method: HttpMethod.PUT
    })
    @RsMapTransition('getTemplatesTransition')
    private updateTemplate(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'PUT /templates';
        const stateName: string = 'updateTemplate';
        router.getRouter().put(HeliosRoute.TEMPLATES_ID, (req: Request, res: Response) => {
            const id: string = req.params.id;
            const templateRef: string = pathPattern + id;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            const updatedTemplate: HeliosTemplate = JSON.parse(req.body);
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            registry.get(id, (err: AsteriaException, template: HeliosTemplate)=> {
                if (err) {
                    HttpErrorUtils.processError(
                        req, res, templateRef, this.ERROR_MEDIATOR.resolveTemplatesError, err
                    );
                } else {
                    if (template) {
                        template.description = updatedTemplate.description;
                        template.processes = updatedTemplate.processes;
                        registry.add(template, (err: AsteriaException)=>{
                            if (err) {
                                HttpErrorUtils.processError(
                                    req, res, templateRef, this.ERROR_MEDIATOR.resolveTemplatesError, err
                                );
                            } else {
                                res.send(HeliosDataBuilder.build<any>(context.getId(), null, stateName));
                            }
                        });
                    } else {
                        res.sendStatus(HttpStatusCode.NOT_FOUND);
                    }
                }
            });
        });
    }
    
    /**
     * Create the route for the <code>/templates/:id</code> resource path and the HTTP <code>DELETE</code> method.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/templates/:id',
        type: StateType.COLLECTION,
        method: HttpMethod.DELETE
    })
    @RsMapTransition('getTemplatesTransition')
    private deleteTemplate(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'DELETE /templates/';
        const stateName: string = 'deleteTemplate';
        router.getRouter().delete(HeliosRoute.TEMPLATES_ID, (req: Request, res: Response) => {
            const id: string = req.params.id;
            const templateRef: string = pathPattern + id;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            const registry: TemplateRegistry = context.getSpiContext().getService(HeliosServiceName.TEMPLATE_REGISTRY);
            registry.has(id, (err: AsteriaException, exists: boolean)=> {
                if (err) {
                    HttpErrorUtils.processError(
                        req, res, templateRef, this.ERROR_MEDIATOR.resolveTemplatesError, err
                    );
                } else if (!exists) {
                    res.sendStatus(HttpStatusCode.NOT_FOUND);
                } else {
                    registry.removeId(id, (err: AsteriaException)=> {
                        if (err) {
                            HttpErrorUtils.processError(
                                req, res, templateRef, this.ERROR_MEDIATOR.resolveTemplatesError, err
                            );
                        } else {
                            const result: HeliosData<HeliosTemplate> = HeliosDataBuilder.build<HeliosTemplate>(
                                context.getId(), null, stateName, { id: id }
                            );
                            res.send(result);
                        }
                    });
                }
            });
        });
    }
}