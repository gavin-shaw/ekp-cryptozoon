import { collection, documents } from '@earnkeeper/ekp-sdk-nestjs';
import {
  Col,
  Container,
  Datatable,
  DatatableColumn,
  formatCurrency,
  formatPercent,
  formatTemplate,
  formatToken,
  Image,
  isBusy,
  Link,
  PageHeaderTile,
  Row,
  UiElement,
} from '@earnkeeper/ekp-ui';
import { MarketListingDocument } from './market-listing.document';

export default function element(): UiElement {
  return Container({
    children: [
      Row({
        children: [
          Col({
            children: [
              PageHeaderTile({
                title: 'Marketplace',
                icon: 'cil-cart',
              }),
            ],
          }),
        ],
      }),
      tableRow(),
    ],
  });
}

function tableRow(): UiElement {
  return Row({
    children: [
      Col({
        children: [
          Datatable({
            columns: tableColumns(),
            data: documents(MarketListingDocument),
            defaultSortAsc: true,
            defaultSortFieldId: 'roiDays',
            filterable: false,
            pagination: true,
            paginationPerPage: 20,
            isBusy: isBusy(collection(MarketListingDocument)),
          }),
        ],
      }),
    ],
  });
}

function tableColumns(): DatatableColumn[] {
  return [
    {
      id: 'imageUrl',
      name: '',
      width: '50px',
      cell: Image({
        src: '$.imageUrl',
        size: 32,
      }),
    },
    {
      id: 'rare',
      width: '72px',
      sortable: true,
    },
    {
      id: 'tribe',
      width: '72px',
      sortable: true,
    },
    {
      id: 'price',
      width: '100px',
      sortable: true,
    },
    {
      id: 'price',
      value: '$.priceFiat',
      name: 'Price $',
      width: '120px',
      label: formatCurrency('$.priceFiat', '$.fiatSymbol'),
      sortable: true,
    },
    {
      id: 'yag24h',
      value: '$.yagReward',
      label: formatToken('$.yagReward'),
      width: '120px',
      sortable: true,
    },
    {
      id: 'roiDays',
      name: 'ROI (Days)',
      width: '120px',
      sortable: true,
    },
    {
      id: 'exp',
      sortable: true,
      width: '100px',
    },
    {
      id: 'zoanType',
      name: 'Type',
      sortable: true,
      width: '140px',
    },
    {
      id: 'clazz',
      name: 'Class',
      sortable: true,
      width: '140px',
    },
    {
      id: 'apr',
      value: '$.apr',
      label: formatPercent('$.apr'),
      sortable: true,
      width: '120px',
    },
    {
      id: 'zoanId',
      value: '$.tokenid',
      cell: Link({
        href: formatTemplate(
          'https://app.cryptozoon.io/my-zoans/{{ zoanId }}',
          { zoanId: '$.tokenId' },
        ),
        external: true,
        content: '$.tokenId',
      }),
      sortable: true,
      width: '100px',
    },
  ];
}
