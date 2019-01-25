function UserService($rootScope, $localStorage) {

  const nav = {
    1: {
      menu: [
        {href: '/view1', name: 'Выбор аптеки'},
        {href: '/view4', name: 'Обработка заявок'},
        {href: '/view3', name: 'Настройка параметров расчета активной матрицы'},
        {href: '/view7', name: 'Журнал заявок'}
      ],
      name: 'Аптека'
    },
    2: {
      menu: [
        {href: '/view11', name: 'Аптеки'},
        {href: '/view12', name: 'Матрицы'},
        {href: '/view13', name: 'Статистика'},
        {href: '/view14', name: 'Перебросы'},
        {href: '/view15', name: 'Прочее'}
      ],
      name: 'Маркетолог'
    },
    4: {
      menu: [
        {href: '/view21', name: 'Аптеки'},
        {href: '/view22', name: 'Пользователи'},
        {href: '/view23', name: 'Монитор'},
        {href: '/view24', name: 'История'},
        {
          href: '',
          name: 'Маркетологи',
          menu: [
            {href: '/view11', name: 'Аптеки'},
            {href: '/view12', name: 'Матрицы'},
            {href: '/view13', name: 'Статистика'},
            {href: '/view14', name: 'Перебросы'},
            {href: '/view15', name: 'Прочее'}
          ]
        }
      ],
      name: 'Техподежка'
    },
    8: {
      menu: [
        {href: '/view1', name: 'Выбор аптеки'},
        {href: '/view4', name: 'Обработка заявок'},
        {href: '/view3', name: 'Настройка параметров расчета активной матрицы'},
        {href: '/view7', name: 'Журнал заявок'},
        {href: '/view8', name: 'Филиал'}
      ],
      name: 'Директор филиала'
    },
  };

  return {
    nav: () => nav
  };
}

UserService.$inject = ['$rootScope', '$localStorage'];

export default UserService;
