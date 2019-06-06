import express from 'express';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { ErrorUtil, AsteriaException, AsteriaContext, AsteriaErrorCode, StreamEventType } from 'asteria-gaia';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HyperionConfig, Hyperion } from 'asteria-hyperion';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { SpiContext } from '../../spi/SpiContext';
import { HeliosTemplate } from 'asteria-eos';

/**
 * The <code>ProcessConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to work with 
 * the Helios <code>/process</code> route.
 */
export class ProcessConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * Create a new <code>ProcessConfigurator</code> instance.
     */
    constructor() {
        super('process');
    }
    
    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        router.getRouter().put(HeliosRoute.PROCESS, (req: express.Request, res: express.Response) => {
            const config: HyperionConfig = req.body;
            HeliosRouterLogUtils.logRoute(req, 'PUT /process');
            try {
                const processor: Hyperion = Hyperion.build(config);
                const spi: SpiContext = context.getSpiContext();
                spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                   .add(processor, (err: AsteriaException)=> {
                        if (err) {
                            this.closeOnError(res, err, AsteriaErrorCode.PROCESS_FAILURE);
                        } else {
                            this.logProcessorRegistryInfo(processor, true);
                            res.on(StreamEventType.FINISH, ()=> {
                                spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                                   .remove(processor, (err: AsteriaException)=> {
                                        if (err) {
                                            HeliosLogger.getLogger().error(err.toString());
                                        } else {
                                            this.logProcessorRegistryInfo(processor, false);
                                        }
                                    });
                            });
                            (processor.run() as any).pipe(res);
                        }
                   });
                
            } catch (e) {
                HeliosLogger.getLogger().error(e.toString());
                res.sendStatus(ErrorUtil.resolveHttpCode(e));
            }
        });
        router.getRouter().post(HeliosRoute.PROCESS_ID, (req: express.Request, res: express.Response) => {
            const id: string = req.params.id;
            const templateRef: string = 'POST /process/' + id;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            const spi: SpiContext = context.getSpiContext();
            spi.getService(HeliosServiceName.TEMPLATE_REGISTRY)
               .get(id, (err: AsteriaException, template: HeliosTemplate)=> {
                    if (err) {
                        this.closeOnError(res, err, err.code);
                    } else {
                        const config: HyperionConfig = {
                            name: template.name,
                            processes: template.processes
                        };
                        try {
                            const processor: Hyperion = Hyperion.build(config);
                            spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                                .add(processor, (err: AsteriaException)=> {
                                    if (err) {
                                        this.closeOnError(res, err, AsteriaErrorCode.PROCESS_FAILURE);
                                    } else {
                                        this.logProcessorRegistryInfo(processor, true);
                                        res.on(StreamEventType.FINISH, ()=> {
                                            spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                                            .remove(processor, (err: AsteriaException)=> {
                                                if (err) {
                                                    HeliosLogger.getLogger().error(err.toString());
                                                } else {
                                                    this.logProcessorRegistryInfo(processor, false);
                                                }
                                                
                                            });
                                        });
                                        (processor.run() as any).pipe(res);
                                    }
                                });
                        } catch (e) {
                            HeliosLogger.getLogger().error(e.toString());
                            res.sendStatus(ErrorUtil.resolveHttpCode(AsteriaErrorCode.PROCESS_FAILURE));
                        }
                    }
                });
        });
        this.routeAdded(HeliosRoute.PROCESS);
    }

    /**
     * Log information when a processor is added to, or removed from, the processor registry.
     * 
     * @param {Hyperion} processor the reference to the processor registry.
     * @param {boolean} add indicates whether the processor is add (<code>true</code>), or not (<code>false</code>).
     */
    private logProcessorRegistryInfo(processor: Hyperion, add: boolean): void {
        const ctx: AsteriaContext = processor.getContext();
        const type: string = add ? 'added to' : 'removed from';
        HeliosLogger.getLogger().info(
            `hyperion processor ${type} registry: name=${ctx.getName()}, id=${ctx.getId()}`
        );
    }

    /**
     * Closes the conection when an error occured out for an Asteria process.
     * 
     * @param {Response} res the reference to the HTTP response for  which to close connection.
     * @param {any} error the error responsible for closing connection.
     * @param {AsteriaErrorCode} code the code of the error responsible for closing connection.
     */
    private closeOnError(res: express.Response, error: any, code: AsteriaErrorCode): void {
        HeliosLogger.getLogger().error(error.toString());
        res.sendStatus(ErrorUtil.resolveHttpCode(code));
    }
}