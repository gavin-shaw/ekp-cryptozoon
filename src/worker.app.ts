import { SdkModule } from '@earnkeeper/ekp-sdk-nestjs';
import { Module } from '@nestjs/common';
import { ContractService } from './contract/contract.service';
import { MarketplaceService } from './marketplace/marketplace.service';
import { UiProcessor } from './ui/ui.processor';

@Module({
  imports: [SdkModule],
  providers: [MarketplaceService, UiProcessor, ContractService],
})
export class WorkerApp {}
