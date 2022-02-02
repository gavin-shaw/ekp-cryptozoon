import {
  ClientService,
  ClientStateChangedEvent,
  LayerDto,
  logger,
} from '@earnkeeper/ekp-sdk-nestjs';
import { Injectable } from '@nestjs/common';
import menus from './menus';
import pages from './pages';

@Injectable()
export class UiProcessor {
  constructor(private clientService: ClientService) {
    this.clientService.clientStateEvents$.subscribe(
      (event: ClientStateChangedEvent) =>
        this.handleClientStateChangedEvent(event),
    );
  }

  async handleClientStateChangedEvent(event: ClientStateChangedEvent) {
    const { clientId } = event;

    logger.log(`Processing UI_QUEUE for ${clientId}`);

    const layers = <LayerDto[]>[
      {
        id: 'cryptozoon-menu-layer',
        collectionName: 'menus',
        set: menus(),
      },
      {
        id: 'cryptozoon-pages-layer',
        collectionName: 'pages',
        set: pages(),
      },
    ];

    this.clientService.addLayers(clientId, layers);
  }
}
