import { Helios } from '../core/Helios';
import { HeliosFactory } from '../util/factory/HeliosFactory';

const server: Helios = HeliosFactory.create();
server.start();
