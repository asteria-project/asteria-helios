import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HttpStatusCode, AsteriaException, StreamEventType, CommonChar } from 'asteria-gaia';
import { FileWalker } from '../../util/io/FileWalker';
import { HeliosFileStats, HeliosData } from 'asteria-eos';
import { SpiContext } from '../../spi/SpiContext';
import { Hyperion, HyperionConfig, HyperionBaseProcessType } from 'asteria-hyperion';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { ModuleRegistry } from '../../service/config/ModuleRegistry';
import { HeliosDataBuilder } from '../../util/builder/HeliosDataBuilder';
import { CsvPreviewDataStream } from '../../stream/data/CsvPreviewDataStream';
import { CsvPreviewDataStreamBuilder } from '../../util/builder/CsvPreviewDataStreamBuilder';
import { HeliosFileStatsBuilder } from '../../util/builder/HeliosFileStatsBuilder';
import { FormDataUtils } from '../../util/net/FormDataUtils';
import { WorkspacePathUtils } from '../../util/io/WorkspacePathUtils';
import { DirUtils } from '../../util/io/DirUtils';
import { WorkspaceErrorMediator } from '../error/WorkspaceErrorMediator';
import { BusboyEventType } from '../../lang/enum/BusboyEventType';
import { FileErrorCode } from '../../lang/enum/FileErrorCode';
import { HttpErrorUtils } from '../../util/error/HttpErrorUtils';
import { RsState, StateType, RsMapTransition, TransitionConfig, RsTransition } from 'jsax-rs';

/**
 * The <code>WorkspaceConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to declare 
 * the Helios <code>/workspace</code> route.
 */
export class WorkspaceConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * Transition declaration of the "/workspace/controller/list" resource path.
     */
    @RsTransition({
        resource: '/workspace/controller/list',
        type: StateType.CONTROLLER
    })
    public readonly listFileTransition: TransitionConfig;

    /**
     * The reference to the object that manages errors for this route configurator.
     */
    private readonly ERROR_MEDIATOR: WorkspaceErrorMediator = null;

    /**
     * Create a new <code>WorkspaceConfigurator</code> instance.
     */
    constructor() {
        super('workspace');
        this.ERROR_MEDIATOR = new WorkspaceErrorMediator();
    }

    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        this.listFiles(router, context);
        this.previewCsv(router, context);
        this.uploadFile(router, context);
        this.downloadFile(router, context);
        this.removeFileOrDir(router, context);
        this.makeDir(router, context);
        this.renameFileOrDir(router, context);
        this.routeAdded(HeliosRoute.WOKSPACE);
    }

    /**
     * Create the route for the <code>/workspace/controller/list</code> resource path.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/workspace/controller/list',
        type: StateType.CONTROLLER
    })
    private listFiles(router: HeliosRouter, context: HeliosContext): void {
        const fileWalker: FileWalker = new FileWalker(context);
        const stateName: string = 'listFiles';
        const pathPattern: string = 'POST /workspace/controller/list?path=';
        router.getRouter().post(HeliosRoute.WOKSPACE_CONTROLLER_LIST, (req: Request, res: Response) => {
            const pathParam: string = req.query.path || CommonChar.EMPTY;
            const templateRef: string = pathPattern + pathParam;
            const realPath: string = WorkspacePathUtils.getInstance(context).getRealPath(pathParam);
            HeliosRouterLogUtils.logRoute(req, templateRef);
            fileWalker.readDir(realPath, (error: NodeJS.ErrnoException, statsList: Array<HeliosFileStats>)=> {
                if (error) {
                    HttpErrorUtils.processError(req, res, templateRef, this.ERROR_MEDIATOR.resolveListError, error);
                } else {
                    const result: HeliosData<Array<HeliosFileStats>> = 
                        HeliosDataBuilder.build<Array<HeliosFileStats>>(context.getId(), statsList, stateName);
                    res.send(result);
                }
            });
        });
    }

    /**
     * Create the route for the <code>/workspace/controller/upload</code> resource path.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/workspace/controller/upload',
        type: StateType.CONTROLLER
    })
    @RsMapTransition('listFileTransition')
    private uploadFile(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'POST /workspace/controller/upload?path=';
        const stateName: string = 'uploadFile';
        const CONNECTION_CLOSE: any = { 'Connection': 'close' };
        router.getRouter().post(HeliosRoute.WOKSPACE_CONTROLLER_UPLOAD, (req: Request, res: Response) => {
            const pathParam: string = req.query.path || CommonChar.EMPTY;
            const templateRef: string = pathPattern + pathParam;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            try {
                const formDataStream: busboy.Busboy = FormDataUtils.buildFormDataStream(req);
                const realPath: string = WorkspacePathUtils.getInstance(context).getRealPath(pathParam);
                let filePath: fs.PathLike = null;
                let fileName: string = null;
                formDataStream.on(BusboyEventType.FILE,
                                  (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string,
                                   mimetype: string)=> {
                    filePath = path.join(realPath, filename);
                    fileName = filename;
                    fs.exists(realPath, (exists: boolean)=> {
                        if (!exists) {
                            DirUtils.getInstance().mkdirp(realPath, null, (err: NodeJS.ErrnoException)=> {
                                if (err) {
                                    HeliosRouterLogUtils.processInternalError(
                                        req, templateRef, HttpStatusCode.INTERNAL_SERVER_ERROR, err
                                    );
                                } else {
                                    file.pipe(fs.createWriteStream(filePath));
                                }
                            })
                        } else {
                            file.pipe(fs.createWriteStream(filePath));
                        }
                    });
                });
                formDataStream.on(BusboyEventType.FINISH, ()=> {
                    setTimeout(()=> {
                        fs.stat(filePath, (err: NodeJS.ErrnoException, stats: fs.Stats)=> {
                            if (err) {
                                HeliosRouterLogUtils.processInternalError(
                                    req, templateRef, HttpStatusCode.INTERNAL_SERVER_ERROR, err
                                );
                            } else {
                                res.writeHead(HttpStatusCode.OK, CONNECTION_CLOSE);
                                const heliosFile: HeliosFileStats = 
                                    this.buildFileStats(path.join(pathParam, fileName), stats);
                                const result: HeliosData<HeliosFileStats> = 
                                    HeliosDataBuilder.build<HeliosFileStats>(context.getId(), heliosFile, stateName);
                                res.end(JSON.stringify(result));
                            }
                        });
                    }, 0);
                });
                req.pipe(formDataStream);
            } catch (error) {
                HttpErrorUtils.processError(req, res, templateRef, this.ERROR_MEDIATOR.resolveUploadHttpError, error);
            }
        });
    }
    
    /**
     * Create the route for the <code>/workspace/controller/remove</code> resource path.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/workspace/controller/remove',
        type: StateType.CONTROLLER
    })
    @RsMapTransition('listFileTransition')
    private removeFileOrDir(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'POST /workspace/controller/remove?path=';
        const stateName: string = 'removeFileOrDir';
        router.getRouter().post(HeliosRoute.WOKSPACE_CONTROLLER_REMOVE, (req: Request, res: Response) => {
            const pathParam: string = req.query.path || CommonChar.EMPTY;
            const templateRef: string = pathPattern + pathParam;
            const realPath: string = WorkspacePathUtils.getInstance(context).getRealPath(pathParam);
            HeliosRouterLogUtils.logRoute(req, templateRef);
            DirUtils.getInstance().rimrf(realPath, (error: NodeJS.ErrnoException)=> {
                if (error) {
                    HttpErrorUtils.processError(req, res, templateRef, this.ERROR_MEDIATOR.resolveRemoveError, error);
                } else {
                    res.send(HeliosDataBuilder.build<any>(context.getId(), null, stateName));
                }
            });
        });
    }

    /**
     * Create the route for the <code>/workspace/controller/download</code> resource path.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/workspace/controller/download',
        type: StateType.CONTROLLER
    })
    @RsMapTransition('listFileTransition')
    private downloadFile(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'POST /workspace/controller/download?path=';
        router.getRouter().post(HeliosRoute.WOKSPACE_CONTROLLER_DOWNLOAD, (req: Request, res: Response) => {
            const pathParam: string = req.query.path || CommonChar.EMPTY;
            const templateRef: string = pathPattern + pathParam;
            const realPath: fs.PathLike = WorkspacePathUtils.getInstance(context).getRealPath(pathParam);
            HeliosRouterLogUtils.logRoute(req, templateRef);
            fs.exists(realPath, (exists: boolean)=> {
                if (exists) {
                    res.status(HttpStatusCode.OK)
                        // TODO: get the real name
                        .download(realPath, 'test.txt', (err: Error)=> {
                            if (err) {
                                HttpErrorUtils.processError(
                                    req, res, templateRef, this.ERROR_MEDIATOR.resolveDownloadError, err
                                );
                            }
                        });
                } else {
                    const error: any = { code: FileErrorCode.ENOENT };
                    HttpErrorUtils.processError(req, res, templateRef, this.ERROR_MEDIATOR.resolveDownloadError, error);
                }
            });
        });
    }

    /**
     * Create the route for the <code>/workspace/controller/mkdir</code> resource path.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/workspace/controller/mkdir',
        type: StateType.CONTROLLER
    })
    @RsMapTransition('listFileTransition')
    private makeDir(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'POST /workspace/controller/mkdir?path=';
        const stateName: string = 'makeDir';
        router.getRouter().post(HeliosRoute.WOKSPACE_CONTROLLER_MKDIR, (req: Request, res: Response) => {
            const pathParam: string = req.query.path;
            const templateRef: string = pathPattern + pathParam;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            if (pathParam) {
                try {
                    const realPath: string = WorkspacePathUtils.getInstance(context).getRealPath(pathParam);
                    fs.exists(realPath, (exists: boolean)=> {
                        if (!exists) {
                            DirUtils.getInstance().mkdirp(realPath, null, (err: NodeJS.ErrnoException)=> {
                                if (err) {
                                    HeliosRouterLogUtils.processInternalError(
                                        req, templateRef, HttpStatusCode.INTERNAL_SERVER_ERROR, err
                                    );
                                } else {
                                    res.status(HttpStatusCode.CREATED)
                                       .send(HeliosDataBuilder.build<any>(context.getId(), null, stateName));
                                }
                            });
                        } else {
                            const error: any = { status: HttpStatusCode.CONFLICT };
                            HttpErrorUtils.processError(
                                req, res, templateRef, this.ERROR_MEDIATOR.resolveMkdirError, error
                            );
                        }
                    });
                } catch (err) {
                    HeliosRouterLogUtils.processInternalError(
                        req, templateRef, HttpStatusCode.INTERNAL_SERVER_ERROR, err
                    );
                }
            } else {
                const error: any = { status: HttpStatusCode.UNPROCESSABLE_ENTITY };
                HttpErrorUtils.processError(req, res, templateRef, this.ERROR_MEDIATOR.resolveMkdirError, error);
            }
        });
    }

    /**
     * Create the route for the <code>/workspace/controller/rename</code> resource path.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/workspace/controller/rename',
        type: StateType.CONTROLLER
    })
    @RsMapTransition('listFileTransition')
    private renameFileOrDir(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'POST /workspace/controller/rename?oldPath=&newPath=';
        const stateName: string = 'renameFileOrDir';
        router.getRouter().post(HeliosRoute.WOKSPACE_CONTROLLER_RENAME, (req: Request, res: Response) => {
            const oldPathParam: string = req.query.oldPath;
            const newPathParam: string = req.query.newPath;
            HeliosRouterLogUtils.logRoute(req, pathPattern);
            if (oldPathParam && newPathParam) {
                const realOldPath: string = WorkspacePathUtils.getInstance(context).getRealPath(oldPathParam);
                const realNewPath: string = WorkspacePathUtils.getInstance(context).getRealPath(newPathParam);
                fs.exists(realOldPath, (exists: boolean)=> {
                    if (exists) {
                        fs.rename(realOldPath, realNewPath, (err: NodeJS.ErrnoException)=> {
                            if (err) {
                                HeliosRouterLogUtils.processInternalError(
                                    req, pathPattern, HttpStatusCode.INTERNAL_SERVER_ERROR, err
                                );
                            } else {
                                const result: HeliosData<any> = 
                                    HeliosDataBuilder.build<any>(context.getId(), null, stateName);
                                res.status(HttpStatusCode.NO_CONTENT).send(result);
                            }
                        });
                    } else {
                        const error: any = { code: FileErrorCode.ENOENT };
                        HttpErrorUtils.processError(
                            req, res, pathPattern, this.ERROR_MEDIATOR.resolveDownloadError, error
                        );
                    }
                });
            } else {
                const error: any = { status: HttpStatusCode.UNPROCESSABLE_ENTITY };
                HttpErrorUtils.processError(req, res, pathPattern, this.ERROR_MEDIATOR.resolveRenameError, error);
            }
        });
    }

    /**
     * Create the route for the <code>/workspace/controller/preview/</code> resource path.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    private previewCsv(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'POST /workspace/controller/preview?path=';
        router.getRouter().post(HeliosRoute.WOKSPACE_CONTROLLER_PREVIEW, (req: Request, res: Response) => {
            const pathParam: string = req.query.path;
            const templateRef: string = pathPattern + pathParam;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            try {
                const realPath: string = WorkspacePathUtils.getInstance(context).getRealPath(pathParam);
                fs.stat(realPath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
                    if (err) {
                        HttpErrorUtils.processError(
                            req, res, templateRef, this.ERROR_MEDIATOR.resolvePrevieError, err
                        );
                    } else if (stats.isDirectory()) {
                        const error: any = { code: FileErrorCode.EISDIR };
                        HttpErrorUtils.processError(
                            req, res, templateRef, this.ERROR_MEDIATOR.resolvePrevieError, error
                        );
                    } else {
                        const spi: SpiContext = context.getSpiContext();
                        const processor: Hyperion = this.getPreviewProcessor(context, pathParam);
                        spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                            .add(processor, (err: AsteriaException)=> {
                                if (err) {
                                    HttpErrorUtils.processError(
                                        req, res, templateRef, this.ERROR_MEDIATOR.resolvePrevieError, err
                                    );
                                } else {
                                    HeliosRouterLogUtils.logProcessorRegistryInfo(processor, true);
                                    res.on(StreamEventType.FINISH, ()=> {
                                        spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                                        .remove(processor, (err: AsteriaException)=> {
                                            if (err) {
                                                HttpErrorUtils.processError(
                                                    req, res, templateRef, this.ERROR_MEDIATOR.resolvePrevieError, err
                                                );
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
            } catch (err) {
                HeliosRouterLogUtils.processInternalError(req, templateRef, HttpStatusCode.INTERNAL_SERVER_ERROR, err);
            }
        });
    }

    /**
     * Create the preview processor for the specified file resource path.
     * 
     * @param {HeliosContext} context the reference to context for this Helios server instance.
     * @param {string} filePath the file path for which to get the preview.
     * 
     * @returns {Hyperion} the preview processor for the specified file path.
     */
    private getPreviewProcessor(context: HeliosContext, filePath: string): Hyperion {
        const spi: SpiContext = context.getSpiContext();
        const realPath: string = WorkspacePathUtils.getInstance(context).getRealPath(filePath);
        const config: HyperionConfig = {
            name: 'CsvFilePreview',
            processes: [
                {
                    type: HyperionBaseProcessType.CSV_PREVIEW,
                    config: realPath
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