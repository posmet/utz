Ctrl.$inject = ['$scope', '$http', '$notify', 'exchange', '$state', '$timeout', 'TableService', '$filter'];
function Ctrl($scope, $http, $notify, exchange, $state, $timeout, TableService, $filter) {

  const $ctrl = this;
  const DSState = 'gridState14';
  const transferState = 'gridState14-1';
  const readyState = 'gridState14-2';

  $ctrl.step = 'ds';
  $ctrl.exchange = exchange;
  $ctrl.selected = null;
  $ctrl.conditionsReady = [];
  $ctrl.conditionsTransfer = [];
  $ctrl.fieldsListTransfer = [
    { name: 'ГрКод', field: 'Gr_ID', type: 'number', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'Наименование', field: 'Gr_Name', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'Код', field: 'Ph_ID', type: 'number', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'Аптека', field: 'Ph_Name', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'Сверхнорматив', field: 'DS', type: 'number', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'Куда Код', field: 'toPh_ID', type: 'number', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'Куда Аптека', field: 'toPh_Name', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'Скорость продаж', field: 'CalcVel', type: 'number', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'Остаток', field: 'Ost', type: 'number', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'Заявка', field: 'Req', enableCellEdit: true, headerTooltip: true, cellTooltip: true }
  ];
  $ctrl.fieldsListDS = TableService.fieldList().concat([
    { name: 'Акция', field: 'Action', enableCellEdit: true, headerTooltip: true, cellTooltip: true },
    { name: 'Продажи30', field: 'Sales30', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
    { name: 'Продажи60', field: 'Sales60', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
    { name: 'Сверхнормативы', field: 'DS', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
    { name: 'Перемещений', field: 'Tr', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
    {
      name: 'Дней дефектуры',
      field: 'DD',
      enableCellEdit: false,
      type: 'number',
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.DD === 0) {
          return false;
        } else if (row.entity.DD > 10) {
          return 'color-red';
        } else if (row.entity.DD <= 10) {
          return 'color-orange';
        }
      }
      , headerTooltip: true, cellTooltip: true
    },
  ]);
  $ctrl.fieldsListReady = [
    { name: 'Дата', field: 'Dat', grouping: { groupPriority: 0 }, headerTooltip: true, cellTooltip: true},
    { name: 'Код', field: 'Ph_ID', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
    { name: 'Аптека', field: 'Ph_Name', grouping: { groupPriority: 1 }, headerTooltip: true, cellTooltip: true },
    { name: 'Код Куда', field: 'toPh_ID', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
    { name: 'Аптека Куда', field: 'toPh_Name', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
    { name: 'Наименование', field: 'Gr_Name', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
    { name: 'Количество', field: 'Req', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
    { name: 'Отправлено', field: 'Sent', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true }
  ];
  $ctrl.gridOptionsTransfer = {
    enableSorting: true,
    enableFiltering: true,
    multiSelect: false,
    enableRowHeaderSelection:true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    enableEditing: true,
    enableCellEditOnFocus: true,
    showGridFooter: true,
    onRegisterApi: function (gridApi) {
      $ctrl.gridApiTransfer = gridApi;

      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue && colDef.field === 'Req') {
          if (newValue < 1) {
            rowEntity.Req = 1;
          } else if (newValue > rowEntity.DS) {
            rowEntity.Req = rowEntity.DS;
          }
        }
      });

      gridApi.colMovable.on.columnPositionChanged($scope, TableService.saveState.bind(null, transferState, gridApi));
      gridApi.colResizable.on.columnSizeChanged($scope, TableService.saveState.bind(null, transferState, gridApi));
      gridApi.core.on.filterChanged($scope, TableService.saveState.bind(null, transferState, gridApi));
      gridApi.core.on.sortChanged($scope, TableService.saveState.bind(null, transferState, gridApi));
      TableService.restoreState(transferState, gridApi, $scope);
      $timeout(function () {
        gridApi.core.on.columnVisibilityChanged($scope, TableService.saveState.bind(null, transferState, gridApi));
      }, 100);
    },
    columnDefs: $ctrl.fieldsListTransfer,
    headerTemplate: require('../../directives/uiGridHeader.html')
  };
  $ctrl.gridOptionsDS = {
    enableSorting: true,
    enableFiltering: true,
    multiSelect: false,
    enableRowHeaderSelection:true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    showGridFooter: true,
    onRegisterApi: function (gridApi) {
      $ctrl.gridApiDS = gridApi;
      gridApi.colMovable.on.columnPositionChanged($scope, TableService.saveState.bind(null, DSState, gridApi));
      gridApi.colResizable.on.columnSizeChanged($scope, TableService.saveState.bind(null, DSState, gridApi));
      gridApi.core.on.filterChanged($scope, TableService.saveState.bind(null, DSState, gridApi));
      gridApi.core.on.sortChanged($scope, TableService.saveState.bind(null, DSState, gridApi));
      TableService.restoreState(DSState, gridApi, $scope);
      $timeout(function () {
        gridApi.core.on.columnVisibilityChanged($scope, TableService.saveState.bind(null, DSState, gridApi));
      }, 100);
    },
    columnDefs: $ctrl.fieldsListDS,
    headerTemplate: require('../../directives/uiGridHeader.html')
  };
  $ctrl.gridOptionsReady = {
    enableSorting: true,
    enableFiltering: true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    showGridFooter: true,
    onRegisterApi: function (gridApi) {
      $ctrl.gridApiReady = gridApi;
      gridApi.colMovable.on.columnPositionChanged($scope, TableService.saveState.bind(null, readyState, gridApi));
      gridApi.colResizable.on.columnSizeChanged($scope, TableService.saveState.bind(null, readyState, gridApi));
      gridApi.core.on.filterChanged($scope, TableService.saveState.bind(null, readyState, gridApi));
      gridApi.core.on.sortChanged($scope, TableService.saveState.bind(null, readyState, gridApi));
      TableService.restoreState(readyState, gridApi, $scope);
      $timeout(function () {
        gridApi.core.on.columnVisibilityChanged($scope, TableService.saveState.bind(null, readyState, gridApi));
      }, 100);
    },
    columnDefs: $ctrl.fieldsListReady,
    headerTemplate: require('../../directives/uiGridHeader.html')
  };

  $ctrl.onGetDS = function () {
    if (!exchange.conditions.length) {
      return false;
    }
    $http.post('/api/overnorm/', {
      conds: exchange.conditions
    })
    .then(function (response) {
      $ctrl.gridOptionsDS.data = response.data;
    }, function (err) {
      $notify.errors(err);
    });
  };

  $ctrl.onGetReady = function () {
    /*if (!$ctrl.conditionsReady.length) {
      return false;
    }*/
    $http.post('/api/resulttrans/', {
      conds: $ctrl.conditionsReady
    })
    .then(function (response) {
      $ctrl.gridOptionsReady.data = response.data.map(function (item) {
        if (item.Dat) {
          item.Dat = $filter('date')(item.Dat, 'dd.MM.yyyy');
        }
        return item;
      });
    }, function (err) {
      $notify.errors(err);
    });
  };

  $ctrl.onGetTransfer = function () {
    if (!$ctrl.conditionsTransfer.length) {
      return false;
    }
    $http.post('/api/transferto/', {
      conds: $ctrl.conditionsTransfer
    })
    .then(function (response) {
      $ctrl.gridOptionsTransfer.data = response.data;
    }, function (err) {
      $notify.errors(err);
    });
  };

  $ctrl.onReady = function () {
    $ctrl.conditionsReady = $ctrl.exchange.conditions.slice();
    $ctrl.onGetReady();
  };

  $ctrl.onMove = function () {
    $ctrl.selected = $ctrl.gridApiDS.selection.getSelectedRows()[0];
    $ctrl.conditionsTransfer = $ctrl.selected ? [{
      cond: 'eq',
      field: "Ph_ID",
      value: $ctrl.selected.Ph_ID,
      type: 'number'
    }, {
      cond: 'eq',
      field: "Gr_ID",
      value: $ctrl.selected.Gr_ID,
      type: 'number'
    }] : $ctrl.exchange.conditions.slice();
    $ctrl.onGetTransfer();
  };

  $ctrl.onSelectTab = function (tab) {
    if (tab === $ctrl.step) {
      return false;
    }
    $ctrl.step = tab;
    switch (tab) {
      case 'ds':
        $ctrl.onBack();
        break;
      case 'move':
        $ctrl.onMove();
        break;
      case 'ready':
        $ctrl.onReady();
        break;
    }
  };

  $ctrl.onTransfer = function () {
    let selected = $ctrl.gridApiTransfer.selection.getSelectedRows()[0];
    if (selected) {
      $http.post('/api/transfer/', selected)
        .then(function (response) {
          $ctrl.onGetTransfer();
        }, function (err) {
          $notify.errors(err);
        });
    }
  };

  $ctrl.onBack = function () {
    $ctrl.selected = null;
  };

  if (exchange.conditions.length) {
    $ctrl.onGetDS();
  }
}

export default Ctrl;
