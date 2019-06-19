import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HttpStatusCode, AsteriaException, AsteriaErrorCode, ErrorUtil, StreamEventType, CommonChar } from 'asteria-gaia';
import { FileWalker } from '../../util/io/FileWalker';
import { HeliosFileStats, HeliosData } from 'asteria-eos';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { SpiContext } from '../../spi/SpiContext';
import { Hyperion, HyperionConfig, HyperionBaseProcessType } from 'asteria-hyperion';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { ModuleRegistry } from '../../service/config/ModuleRegistry';
import { HeliosRouteUtils } from '../../util/route/HeliosRouteUtils';
import { HeliosDataBuilder } from '../../util/builder/HeliosDataBuilder';
import { CsvPreviewDataStream } from '../../stream/data/CsvPreviewDataStream';
import { CsvPreviewDataStreamBuilder } from '../../util/builder/CsvPreviewDataStreamBuilder';
import { HeliosFileStatsBuilder } from '../../util/builder/HeliosFileStatsBuilder';

/**
 * The <code>WorkspaceConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to declare 
 * the Helios <code>/workspace</code> route.
 */
export class WorkspaceConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * Create a new <code>WorkspaceConfigurator</code> instance.
     */
    constructor() {
        super('workspace');
    }

    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        this.createListRoute(router, context);
        this.createPreviewRoute(router, context);
        this.routeAdded(HeliosRoute.WOKSPACE);
    }

    /**
     * Create the route for the <code>/workspace/controller/list/</code> path.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    private createListRoute(router: HeliosRouter, context: HeliosContext): void {
        const fileWalker: FileWalker = new FileWalker(context);
        router.getRouter().get(HeliosRoute.WOKSPACE_CONTROLLER_LIST, (req: express.Request, res: express.Response) => {
            const pathParam: string = req.params.path || '';
            const templateRef: string = 'GET /workspace/controller/list/' + pathParam;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            fileWalker.readDir(pathParam, (error: AsteriaException, statsList: Array<HeliosFileStats>)=> {
                if (error) {
                    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
                } else {
                    const result: HeliosData<Array<HeliosFileStats>> = 
                        HeliosDataBuilder.build<Array<HeliosFileStats>>(context.getId(), statsList);
                    res.send(result);
                }
            });
        });
    }

    /**
     * Create the route for the <code>/workspace/controller/preview/</code> path.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    private createPreviewRoute(router: HeliosRouter, context: HeliosContext): void {
        router.getRouter().get(HeliosRoute.WOKSPACE_CONTROLLER_PREVIEW, (req: express.Request, res: express.Response) => {
            const pathParam: string = req.params.path;
            const templateRef: string = 'GET /workspace/controller/preview/' + pathParam;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            try {
                const fullPath: string = path.join(context.getWorkspace(), pathParam);
                fs.stat(fullPath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
                    if (err) {
                        HeliosLogger.getLogger().error(err.toString());
                        res.sendStatus(HttpStatusCode.NOT_FOUND);
                    } else {
                        const spi: SpiContext = context.getSpiContext();
                        const processor: Hyperion = this.getPreviewProcessor(context, pathParam);
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
                                    const fileStats: HeliosFileStats = this.buildFileStats(pathParam, stats);
                                    const dataStream: CsvPreviewDataStream = 
                                        CsvPreviewDataStreamBuilder.build(context, processor.getContext(), fileStats);
                                    (processor.run() as any).pipe(dataStream).pipe(res);
                                }
                            });
                    }
                });
            } catch (e) {
                HeliosLogger.getLogger().error(e.toString());
                res.sendStatus(ErrorUtil.resolveHttpCode(AsteriaErrorCode.PROCESS_FAILURE));
            }
        });
    }

    /**
     * Create the preview processor for the specified file path.
     * 
     * @param {HeliosContext} context the reference to context for this Helios server instance.
     * @param {string} filePath the file path for which to get the preview.
     * 
     * @returns {Hyperion} the preview processor for the specified file path.
     */
    private getPreviewProcessor(context: HeliosContext, filePath: string): Hyperion {
        const spi: SpiContext = context.getSpiContext();
        const fullPath: string = path.join(context.getWorkspace(), filePath);
        const config: HyperionConfig = {
            name: 'CsvFilePreview',
            processes: [
                {
                    type: HyperionBaseProcessType.CSV_PREVIEW,
                    config: fullPath
                }
            ]
        };
        const processor: Hyperion = Hyperion.build(config);
        const moduleService: ModuleRegistry = spi.getService(HeliosServiceName.MODULE_REGISTRY) as ModuleRegistry;
        processor.setModuleRegistry(moduleService.getHyperionModuleRegistry());
        return processor;
    }

    /**
     * Build and return a new <code>HeliosFileStats</code> object for the specified file properties.
     * 
     * @param {string} fullPath thge full path to the file for which to get the <code>HeliosFileStats</code> object.
     * @param {HeliosFileStats} stats a new <code>HeliosFileStats</code> object.
     */
    private buildFileStats(fullPath: string, stats: fs.Stats): HeliosFileStats {
        const nameDelimiterId: number = fullPath.lastIndexOf('/');
        const filePath: string = fullPath.substring(0, nameDelimiterId);
        const fileName: string = fullPath.substring(nameDelimiterId + 1);
        return HeliosFileStatsBuilder.build(fileName, filePath, stats);
    }
}