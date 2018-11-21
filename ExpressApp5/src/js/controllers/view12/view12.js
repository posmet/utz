import ExcelJS from 'exceljs/dist/exceljs.min';

Ctrl.$inject = ['$scope', '$http', '$notify', 'exchange', '$state', '$timeout', 'TableService'];
function Ctrl($scope, $http, $notify, exchange, $state, $timeout, TableService) {

  const $ctrl = this;
  const stateName = 'gridState12';

  let rowTemplate = function() {
    return '<div ng-class="{green: row.entity.Action, yellow: row.entity.isLocal}" ' +
      'ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" ui-grid-one-bind-id-grid="rowRenderIndex + \'-\' + col.uid + \'-cell\'" ' +
      'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader}" role="gridcell" ui-grid-cell></div>';
  };

  let applyLoading = function (value) {
    $scope.$apply(function () {
      $scope.loading = value;
    });
  };

  let parseFile = function (rows) {
    let headers = {};
    let results = [];
    let columnKeys = {};
    $ctrl.gridOptions.columnDefs.forEach(function (item) {
      columnKeys[item.name] = item.field;
    });
    rows[0].forEach(function (name, index) {
      if (name && columnKeys[name]) {
        headers[index] = columnKeys[name];
      }
    });
    if (Object.keys(headers).length) {
      rows.forEach(function (row, index) {
        if (index > 0) {
          var json = {};
          row.forEach(function (value, index) {
            if (headers[index]) {
              json[headers[index]] = value;
            }
          });
          if (Object.keys(json).length) {
            json.isLocal = true;
            results.push(json);
          }
        }
      });
      if (results.length) {
        $ctrl.fileData = results;
        $ctrl.gridOptions.data = $ctrl.fileData.concat($ctrl.serverData);
      }
    }
  };

  let readCSV = function (file, columnKeys) {
    let reader = new FileReader();
    reader.onload = function(event) {
      $scope.$apply(function () {
        parseFile(CSV.parse(event.target.result));
        $scope.loading = false;
      });
    };
    reader.onerror = function () {
      applyLoading(false);
    };
    $scope.loading = true;
    reader.readAsText(file);
  };

  let readXLS = function (file, columnKeys) {
    let reader = new FileReader();
    reader.onload = function(event) {
      new ExcelJS.Workbook().xlsx
        .load(event.target.result)
        .then(function (workbook) {
          var rows = [];
          workbook.worksheets[0].eachRow(function (row, rowNumber) {
            rows.push(row.values);
          });
          return parseFile(rows);
        })
        .then(function () {
          applyLoading(false);
        });
    };
    reader.onerror = function () {
      $scope.loading = false;
    };
    $scope.loading = true;
    reader.readAsArrayBuffer(file);
  };
  $ctrl.msg = {};
  $ctrl.exchange = exchange;
  $ctrl.matrix = false;
  $ctrl.matrixlabel = "Все";
  $ctrl.checkadd = false;
  $ctrl.fieldsList = TableService.fieldList().concat([
    { name: 'Акция', field: 'Action', enableCellEdit: true },
    { name: 'Продажи30', field: 'Sales30', enableCellEdit: false, type: 'number' },
    { name: 'Продажи60', field: 'Sales60', enableCellEdit: false, type: 'number' }
  ]);
  $ctrl.fileData = [];
  $ctrl.serverData = [];
  $ctrl.gridOptions = {
    enableFiltering: true,
    enableEditing: true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    enableRowHeaderSelection:true,
    multiSelect: false,
    showGridFooter: true,
    enableCellEditOnFocus: true,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
        if (newValue != oldValue) {
          TableService.minQty05.apply(null, arguments);
          $http.post('/api/updatemx/', rowEntity).then(function (response) {
            $ctrl.msg.lastCellEdited = 'Изменено строка:' + rowEntity.Gr_ID + ' Столбец:' + colDef.name + ' Было:' + oldValue + ' Стало:' + newValue;
            $scope.$apply();
          }, function (err) {
            $notify.errors(err);
          });
        }
      });
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        exchange.grid = row.entity.Gr_ID;
        exchange.grname = row.entity.Gr_Name;
        exchange.phname = row.entity.Ph_Name;
        exchange.pharmid = row.entity.Ph_ID;
        exchange.entity = row.entity;
      });
      gridApi.colMovable.on.columnPositionChanged($scope, TableService.saveState.bind(null, stateName, gridApi));
      gridApi.colResizable.on.columnSizeChanged($scope, TableService.saveState.bind(null, stateName, gridApi));
      gridApi.core.on.filterChanged($scope, TableService.saveState.bind(null, stateName, gridApi));
      gridApi.core.on.sortChanged($scope, TableService.saveState.bind(null, stateName, gridApi));
      TableService.restoreState(stateName, gridApi, $scope);
      $timeout(function () {
        gridApi.core.on.columnVisibilityChanged($scope, TableService.saveState.bind(null, stateName, gridApi));
      }, 100);
    },
    columnDefs: $ctrl.fieldsList,
    rowTemplate: rowTemplate()
  };

  $ctrl.onClick = function () {
    if (!$ctrl.exchange.pharmid) {
      $ctrl.exchange.pharmid = 0;
    }
    if (!$ctrl.exchange.grid) {
      $ctrl.exchange.grid = 0;
    }
    $http.post('/api/ResultMtrxn/', {
      conds: $ctrl.exchange.conditions
    })
      .then(function (response) {
        $ctrl.serverData = response.data;
        $ctrl.gridOptions.data = $ctrl.fileData.concat($ctrl.serverData);
      }, function (err) {
        $notify.errors(err);
      });
  };

  $ctrl.onFile = function (files) {
    if (!files[0]) {
      return false;
    }
    if (!/\.(csv|xls|xlsx)$/.test(files[0].name)) {
      return false;
    }
    if (/\.csv$/.test(files[0].name)) {
      return readCSV(files[0]);
    } else {
      return readXLS(files[0]);
    }
  };

  $ctrl.onSend = function () {
    if (!$ctrl.fileData.length) {
      return false;
    }
    alert('отправка ' + $ctrl.fileData.length + ' записей');
    $http.post('/api/test/', {items: $ctrl.fileData})
      .then(function (response) {
        $notify.success('Записи успешно отправлены');
      }, function (err) {
        $notify.errors(err);
      });
  };

  $ctrl.onDelete = function () {
    $ctrl.rsp = "удаление" + $ctrl.exchange.Gr_Name;
    $http.post('/api/deletemx/', exchange.entity)
      .then(function (response) {
        $ctrl.rsp = '';
        $ctrl.gridOptions.data[$ctrl.gridOptions.data.indexOf(exchange.entity)] = response.data;
      },
      function (err) {
        $notify.errors(err);
      });
  };

  $ctrl.onAdd = function (pharm, $index) {
    console.log($ctrl.gridOptions.data.indexOf(exchange.entity));
    console.log($ctrl.gridOptions.data[$ctrl.gridOptions.data.indexOf(exchange.entity)]);
    if (exchange.entity.M == 'Н') {
      $ctrl.rsp = "добавление";
      $http.post('/api/addmx/', exchange.entity)
        .then(function (response) {
          $ctrl.rsp = '';
          $ctrl.gridOptions.data[$ctrl.gridOptions.data.indexOf(exchange.entity)] = response.data;
        }, function (err) {
          $notify.errors(err);
        });
    }
  };

  $ctrl.onSearch = function () {
    if (!$ctrl.searchPh) {
      $ctrl.searchPh = 0;
    }
    if (!$ctrl.searchGrp) {
      $ctrl.searchGrp = 0;
    }
    $http({
      method: 'GET',
      url: '/api/resultmtrxacc'
    })
    .then(function (response) {
      $ctrl.gridOptions.data = response.data;
    }, function (err) {
      $notify.errors(err);
    });

  };

  $ctrl.onStat = function () {
    $state.go('app.view13');
  };

  if (($ctrl.exchange.conditions.length > 0)) {
    $ctrl.onClick();
  }

  $ctrl.onCheck = function () {
    $ctrl.matrixlabel = $ctrl.matrix ? "Все":"Матрица" ;
  }
}

export default Ctrl;