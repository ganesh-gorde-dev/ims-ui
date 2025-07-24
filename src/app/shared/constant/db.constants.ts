export enum MASTER_DATA {
  AUTHENTICATION_TYPES = 'authentication_types',
  DATABASE_STRATEGY_TYPES = 'database_strategy_types',
  METHOD_TYPES = 'method_types',
  NOTIFICATION_TYPES = 'notification_types',
  ROLE_TYPES = 'role_types',
  SEVERITY_TYPES = 'severity_types',
  STOK_TYPES = 'stock_types',
  DB_SERVER = 'database_server_types',
}

export enum LOGIN_TYPE {
  ADMIN = 'ADMIN',
  TENANT = 'TENANT',
}

export enum PERMISSION_MODULE {
  USER = 'User',
  PRODUCT = 'Product',
  CATEGORY = 'Category',
  PERMISSION = 'Permission',
  ROLE_PERMISSION = 'Role Permission',
  STOCK = 'Stock',
  NOTIFICATION = 'Notification',
  SUPPLIER = 'Supplier',
  REPORT = 'Report Stock Summary',
  AUDIT_LOGS = 'Audit Logs',
}

export enum PERMISSION {
  CREATE_USER = 'ab13d047-f094-4fcc-a620-d160edfa2421',
  GET_USER = '79ae7f7a-fc23-4870-b0ae-1ef481f3f0b3',
  UPDATE_USER = '167db5ea-a3fa-474e-ae95-95bb31cb4302',
  DELETE_USER = 'aaf8b857-9bc8-48d7-9788-57ef971a1263',

  GET_PERMISSION = '79ec13cc-2e00-4f64-82d2-3737dfb421d1',

  CREATE_ROLE_PERMISSION = '9bd74feb-827f-4929-9600-fc3ca3a5f90c',
  GET_ROLE_PERMISSION = '448ee5ff-1f80-484d-8c35-0f74ad1b7221',

  CREATE_CATEGORY = 'bf2b69a9-b9d2-42ee-89d8-dd6f69f0e3a4',
  GET_CATEGORY = '886f2cb7-b546-4153-8a7f-54f43350573f',
  UPDATE_CATEGORY = 'd555b130-d8e8-4d9b-bc3a-8b543ac66056',
  DELETE_CATEGORY = 'cc613f20-a922-4c74-a71e-215f379d6aff',

  CREATE_PRODUCT = '64b70e32-d1ff-4f3d-a632-c258eac5e992',
  GET_PRODUCT = 'e35f703b-2a2e-45f8-95c8-03c02eda2627',
  UPDATE_PRODUCT = '850b5e1b-3d0b-4dfa-869c-2fc38ce25ef0',
  DELETE_PRODUCT = '9e50c90a-606b-4930-855e-8cce62e7d6bb',

  CREATE_STOCK = 'a5615fee-35b6-4bf4-bc3a-bc698db4af7b',
  GET_STOCK = '69e0ff45-25fe-408b-8712-878dd845913c',
  DELETE_STOCK = '509fc813-0b41-4d2b-bef4-35abb970b06a',

  GET_NOTIFICATION = 'ad4f0e87-b91c-439b-bc98-d026f88059c6',
  MAKE_NOTIFICATION_MARK_AS_READ = '11d86afd-ae6a-4414-b9e6-fdb87d4034c7',

  CREATE_SUPPLIER = 'c17129de-f3bc-41fc-bbc3-c984128c5f5a',
  GET_SUPPLIER = '3c8dcb5b-019d-404e-825d-2d72c12932e2',
  UPDATE_SUPPLIER = '57d12541-1074-4db0-b4e7-f6e239ae4beb',
  DELETE_SUPPLIER = '65704bd1-254d-42dc-bd6b-d948fd5319b3',

  GET_STOCK_SUMMARY = '075aa86e-4000-4d2b-9147-622a566f9600',
  GET_AUDIT_LOGS = '29be0419-a27a-478d-936c-9bcee56c7a6f',
}

export const NAV_LINKS = [
  {
    label: 'Product',
    path: '/tenant/product',
    icon: 'shopping_cart',
    module: 'Product',
  },
  {
    label: 'Category',
    path: '/tenant/category',
    icon: 'category',
    module: 'Category',
  },
  {
    label: 'User Management',
    path: '/tenant/user-management',
    icon: 'group',
    module: 'User',
  },
  {
    label: 'Role Management',
    path: '/tenant/role',
    icon: 'add_moderator',
    module: 'Role Permission',
  },
  {
    label: 'Stock',
    path: '/tenant/stock',
    icon: 'inventory_2',
    module: 'Stock',
  },
  {
    label: 'Supplier',
    path: '/tenant/supplier',
    icon: 'delivery_truck_bolt',
    module: 'Supplier',
  },
  // {
  //   label: 'Roles & Permission',
  //   path: '/tenant/roles-permission',
  //   icon: 'passkey',
  // },
  // {
  //   label: 'Reports',
  //   path: '/tenant/reports',
  //   icon: 'finance_mode',
  // },
  // {
  //   label: 'Audit Logs',
  //   path: '/tenant/audit-logs',
  //   icon: 'deployed_code_history',
  // },
];
