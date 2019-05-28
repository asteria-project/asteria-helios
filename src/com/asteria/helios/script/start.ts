import { HeliosFactory } from '../util/factory/HeliosFactory';
import { Helios } from '../core/Helios';
import { AbstractHeliosRouteConfigurator } from '../route/configurator/AbstractHeliosRouteConfigurator';
import { HeliosRouteConfigurator } from '../route/HeliosRouteConfigurator';
import { HeliosRouter } from '../route/HeliosRouter';
import { HeliosContext } from '../core/HeliosContext';
import { HeliosServiceName } from '../core/HeliosServiceName';

/*class HelloWorldRouteConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

	constructor() {
      super('hello-world');
    }

    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        router.getRouter().get('/hello-world', (req: any, res: any) => {
            res.send('Hello World!');
        });
       this.routeAdded('/hello-world');
    }
}*/

const server: Helios = HeliosFactory.create();
/*server.getContext()
      .getSpiContext()
      .getService(HeliosServiceName.ROUTE_CONFIG_REGISTRY)
      .add(new HelloWorldRouteConfigurator());*/
server.start();
