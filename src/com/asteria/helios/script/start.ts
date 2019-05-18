import { HeliosFactory } from '../util/factory/HeliosFactory';
import { Helios } from '../core/Helios';

const server: Helios = HeliosFactory.create();
server.getContext().getSpiContext();
server.start();
