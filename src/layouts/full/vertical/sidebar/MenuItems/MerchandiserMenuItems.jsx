import {
    IconAperture,
    IconBriefcase,
    IconFileInvoice,
    IconHome2,
    IconScan,
    IconTruckDelivery,
  } from '@tabler/icons';
  
  import { uniqueId } from 'lodash';
  
  const Menuitems = [
    {
      navlabel: true,
      subheader: 'Home',
    },
    {
      id: uniqueId(),
      title: 'Dashboard',
      icon: IconHome2,
      href: '/merchandiser/dashboard',
    },
    {
      id: uniqueId(),
      title: 'Indent',
      icon: IconAperture,
      href: '/merchandiser/indent',
      children: [
        {
          id: uniqueId(),
          title: 'Rise',
          icon: IconHome2,
          href: '/merchandiser/indent/rise',
        },
        {
          id: uniqueId(),
          title: 'Request',
          icon: IconHome2,
          href: '/merchandiser/indent/request',
        },
      ]
    },
    {
      id: uniqueId(),
      title: 'JobCard',
      icon: IconBriefcase,
      href: '/merchandiser/jobcard',
    },
    {
      id: uniqueId(),
      title: 'Bill Of Materials',
      icon: IconFileInvoice,
      href: '/merchandiser/bom',
    },
    {
      id: uniqueId(),
      title: 'Delivery Challan',
      icon: IconTruckDelivery,
      href: '/merchandiser/deliverychallan',
    },
    {
      id: uniqueId(),
      title: 'Barcode Management',
      icon: IconScan,
      href: '/merchandiser/barcode',
    },
  
  ];
  
  export default Menuitems;
  