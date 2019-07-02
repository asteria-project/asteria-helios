import { Request, Response } from 'express';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { ErrorUtil, AsteriaException, AsteriaErrorCode, StreamEventType } from 'asteria-gaia';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HyperionConfig, Hyperion } from 'asteria-hyperion';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { SpiContext } from '../../spi/SpiContext';
import { HeliosTemplate } from 'asteria-eos';
import { ModuleRegistry } from '../../service/config/ModuleRegistry';
import { HeliosRouteUtils } from '../../util/route/HeliosRouteUtils';

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
        router.getRouter().put(HeliosRoute.PROCESS, (req: Request, res: Response) => {
            const config: HyperionConfig = req.body;
            HeliosRouterLogUtils.logRoute(req, 'PUT /process/controller');
            try {
                const processor: Hyperion = Hyperion.build(config);
                const spi: SpiContext = context.getSpiContext();
                spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                   .add(processor, (err: AsteriaException)=> {
                        if (err) {
                            HeliosRouteUtils.closeOnError(res, err, AsteriaErrorCode.PROCESS_FAILURE);
                        } else {
                            HeliosRouterLogUtils.logProcessorRegistryInfo(processor, true);
                            res.on(StreamEventType.FINISH, ()=> {
                                spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                                   .remove(processor, (err: AsteriaException)=> {
                                        if (err) {
                                            HeliosLogger.getLogger().error(err.toString());
                                        } else {
                                            HeliosRouterLogUtils.logProcessorRegistryInfo(processor, false);
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
        router.getRouter().post(HeliosRoute.PROCESS_ID, (req: Request, res: Response) => {
            const id: string = req.params.id;
            const templateRef: string = 'POST /process/controller/' + id;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            const spi: SpiContext = context.getSpiContext();
            spi.getService(HeliosServiceName.TEMPLATE_REGISTRY)
               .get(id, (err: AsteriaException, template: HeliosTemplate)=> {
                    if (err) {
                        HeliosRouteUtils.closeOnError(res, err, err.code);
                    } else {
                        const config: HyperionConfig = {
                            name: template.name,
                            processes: template.processes
                        };
                        try {
                            const processor: Hyperion = Hyperion.build(config);
                            const moduleService: ModuleRegistry = 
                                spi.getService(HeliosServiceName.MODULE_REGISTRY) as ModuleRegistry;
                            processor.setModuleRegistry(moduleService.getHyperionModuleRegistry());
                            spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                                .add(processor, (err: AsteriaException)=> {
                                    if (err) {
                                        HeliosRouteUtils.closeOnError(res, err, AsteriaErrorCode.PROCESS_FAILURE);
                                    } else {
                                        HeliosRouterLogUtils.logProcessorRegistryInfo(processor, true);
                                        res.on(StreamEventType.FINISH, ()=> {
                                            spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                                            .remove(processor, (err: AsteriaException)=> {
                                                if (err) {
                                                    HeliosLogger.getLogger().error(err.toString());
                                                } else {
                                                    HeliosRouterLogUtils.logProcessorRegistryInfo(processor, false);
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
}