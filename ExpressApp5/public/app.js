﻿var app = angular.module('app', ['ngRoute', 'ngTouch','ngCookies',
    'ui.grid', 'ui.grid.saveState', 'ui.grid.edit', 'ui.grid.exporter',
    'ui.grid.moveColumns', 'ui.grid.autoResize', 'ui.grid.resizeColumns',
    'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.expandable',
   'ui.grid.importer','ui.grid.grouping','ngAria', 'chart.js'])
    .
    run(function ($rootScope) {
        $rootScope.test = new Date();
        $rootScope.pharmname = '';
        $rootScope.pharmid = 0;
        $rootScope.grname = "";
        $rootScope.grid = 0;
    }).
    config(function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/view1', {
                templateUrl: 'partial5',
                controller: 'MyCtrl5'
            }).
            when('/view2', {
                templateUrl: 'partial2',
                controller: 'MyCtrl2'
            }).
            when('/view3', {
                templateUrl: 'partial3',
                controller: 'MyCtrl3'
            }).
            when('/view4', {
                templateUrl: 'partial4',
                controller: 'MyCtrl4'
            }).
            when('/view7', {
                templateUrl: 'partial7',
                controller: 'MyCtrl7'
            }).
            when('/view11', {
                templateUrl: 'partial11n',
                controller: 'MyCtrl11'
            }).
            when('/view12', {
                templateUrl: 'partial12n',
                controller: 'MyCtrl12'
            }).
            when('/view13', {
                templateUrl: 'partial13n',
                controller: 'MyCtrl13'
            }).
            when('/view14', {
                templateUrl: 'partial14n',
                controller: 'MyCtrl14'
            }).
            when('/view15', {
                templateUrl: 'partial15n',
                controller: 'MyCtrl15'
            }).
            otherwise({
                redirectTo: '/view1'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });
app.controller('AppCtrl', function ($scope, $http, $rootScope) {
    //$scope.exfac = exchange;
    $scope.interface1 = false;
    $scope.interface2 = false;
    $scope.interface3 = false;
    $http({
        method: 'GET',
        url: '/api/name'
    }).
        then(function (response) {
            $scope.user = response.data;
        }, function (data, status, headers, config) {
            $scope.name = 'Error!';
        });

});
app.controller('MyCtrl1', function ($scope, $http) {
    //$scope.exfac = exchange;
    $scope.pharmname = 'Тестовая аптека';
    $scope.pharmid = 1;
    // $scope.clickph = function(pharm,index){
    //     $scope.pharmid = index;
    // };
    $http({
        method: 'GET',
        url: '/api/Result'
    }).
        then(function (response) {
            $scope.result = response.data;
        }, function (data, status, headers, config) {
            $scope.result = 'Error!';
        });

});
app.controller('MyCtrl3', ['$scope', '$http', 'exchange', 'i18nService', function ($scope, $http, exchange,i18nService) {
    var vm = this;
    vm.msg = {};
    vm.exchange = exchange;
    i18nService.setCurrentLang('ru');
    $scope.deleteRow = function (row) {
        var index = vm.gridOptions.data.indexOf(row.entity);
        $scope.ondelete(row.entity, 0);
        vm.gridOptions.data.splice(index, 1);

    }
    vm.gridOptions = {
        enableFiltering: true,
        enableEditing: true,
        exporterMenuCsv: true,
        enableGridMenu: true,
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        multiSelect: true,
        showGridFooter: true,
        onRegisterApi: function (gridApi) {
            vm.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
                $http({
                    method: 'GET',
                    url: '/api/updatemx/' + rowEntity.Ph_ID + "/" + rowEntity.Gr_ID + "/" + rowEntity.MinQty + "/" + rowEntity.MinReq + "/" + rowEntity.Ratio + "/" + rowEntity.TempReq 
                }).
                    then(function (response) {
                        vm.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                        $scope.$apply();
                        //vm.gridOptions.data = response.data;
                    }, function (data, status, headers, config) {
                        $scope.Result = 'Error!';
                    });
            });
            //   gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            //
            //              exchange.grid = row.entity.Gr_ID;
            //                exchange.grname = row.entity.Gr_Name;
            //                exchange.phname = row.entity.Ph_Name;
            //                exchange.pharmid = row.entity.Ph_ID;
            //            });
        },
        columnDefs: [
            { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number' },
            { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false },
            { name: 'Кратность', field: 'Ratio', enableCellEdit: true, type: 'number' },
            { name: 'Мин Запас', field: 'MinQty', enableCellEdit: true, type: 'number' },
            { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: true, type: 'number' },
            { name: 'Врем Заказ', field: 'TempReq', enableCellEdit: true, type: 'number' },
            { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number' },
            { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number' },
            { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number' },
            { name: 'Матрица', field: 'Matrix',  enableCellEdit: false },
            { name: 'Маркетинг', field: 'Marketing',  enableCellEdit: false },
            { name: 'Цена закупки', field: 'PriceIn', enableCellEdit: false, type: 'number' },
            { name: 'Цена продажи', field: 'PriceOut', enableCellEdit: false, type: 'number' },
            { name: 'X',width:'30', cellTemplate: '<button class="btn btn-outline-danger btn-sm" ng-click="grid.appScope.deleteRow(row)">X</button>'}
        ]
    };

    //$http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
    //  .then(function(response) {
    //    vm.gridOptions.data = response.data;
    //    });

    $scope.onClick = function () {
        if (!vm.exchange.pharmid) {
            vm.exchange.pharmid = 0;
        }
        if (!vm.exchange.grid) {
            vm.exchange.grid = 0;
        }
        $scope.loading = true;
        $http({
            method: 'GET',
            url: '/api/ResultMtrxa/' + vm.exchange.pharmid + '/' + vm.exchange.grid
        }).
            then(function (response) {
                //           var data = response.data;
                //           for (var i = 0; i < 6; i++) {
                //               data = data.concat(data);
                //           }
                vm.gridOptions.data = response.data;
                $scope.loading = false;
                // $scope.loadMore();
            }, function (data, status, headers, config) {
                $scope.Resulta = 'Error!';
            });

    }
    $scope.onaccept = function (phaольгаrm, $index) {
        //
        $scope.rsp = '/api/acceptmx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
        $http({
            method: 'GET',
            url: '/api/acceptmx/' + pharm.Ph_ID + "/" + pharm.Gr_ID
        }).
            then(function (response) {
                $scope.rsp = response.data;
                $scope.mtrx.splice($index, 1);
            }, function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });
    };
    $scope.ondelete = function (pharm, $index) {

        //
        $scope.rsp = "удаление" + $index;
        $scope.rsp = '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
        $http({
            method: 'GET',
            url: '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID
        }).
            then(function (response) {
                $scope.rsp = response.data;
            },
            function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });
        //$scope.mtrx.splice($index, 1);
    };
    $scope.oncreate = function (pharm, $index) {
        //
        $scope.rsp = "добавление";
        $scope.checkadd = !$scope.checkadd;
        $scope.rsp = $scope.newgrpcode;
        if (!$scope.checkadd) {
            $http({
                method: 'GET',
                url: '/api/addmx/' + vm.exchange.pharmid + "/" + $scope.newgrpcode
            }).
                then(function (response) {
                    $scope.rsp = response.data;
                },
                function (data, status, headers, config) {
                    $scope.Result = 'Error!';
                });
        }
    };
    $scope.onSearch = function () {
        if (!$scope.searchPh) {
            $scope.searchPh = 0;
        }
        if (!$scope.searchGrp) {
            $scope.searchGrp = 0;
        }
        $http({
            method: 'GET',
            url: '/api/resultmtrxacc'
        }).
            then(function (response) {
                vm.gridOptions.data = response.data;
                // $scope.loadMore();
            }, function (data, status, headers, config) {
                $scope.Resulta = 'Error!';
            });

    }
    $scope.onstat = function () {
        //   exchange.pharmid = 1;
        //   exchange.grid = 1;
        //   exchange.phname = 'testph';
        //   exchange.grname = 'testgr';
        $location.path('/view13');
    }
    $scope.OnSend = function () {
        $http({
            method: 'GET',
            url: '/api/send/' + $scope.pharmid
        }).
            then(function (response) {
                $scope.rsp = response.data;
            }, function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });
        $location.path('/');
    };
    $scope.onedit = function (pharm, $index) {
        //  $scope.rsp = 'Editing' + $index+ $scope.rq[$index].GrCode;
        if (!pharm.Req) pharm.Req = 0;
        $scope.rsp = '/api/updaterq/' + pharm.Ph_ID + "/" + pharm.GrCode + "/" + pharm.Req;
        //$scope.rsp = pharm.Gr_Name;
        console.log(pharm);
        $scope.editable = false;
        if (pharm.Req > pharm.qmax) pharm.Req = pharm.qmax;
        if (pharm.Req < pharm.qmin) pharm.Req = pharm.qmin;
        $http({
            method: 'GET',
            url: '/api/updaterq/' + pharm.Ph_ID + "/" + pharm.GrCode + "/" + pharm.Req
        }).
            then(function (response) {
                $scope.rsp = response.data;
            }, function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });
    };
    $http({
        method: 'GET',
        url: '/api/Resultmtrx/' + vm.exchange.pharmid
    }).
        then(function (response) {
            if (response.data.length > 0) {
                $scope.sent = response.data[0].sent > 0;
                // $scope.pharmname = data[0].ph_name;
                // $scope.pharmid = data[0].ph_id;
            };
            vm.gridOptions.data = response.data;
        }, function (data, status, headers, config) {
            $scope.Result = 'Error!';
        });

}]);
app.controller('MyCtrl4', ['$scope', '$http', '$location', '$rootScope', 'exchange', 'i18nService', function ($scope, $http, $location, $rootScope, exchange,i18nService) {
    var vm = this;
    vm.msg = {};
    vm.exchange = exchange;
    i18nService.setCurrentLang('ru');
    vm.gridOptions = {
        enableFiltering: true,
        enableEditing: true,
        exporterMenuCsv: true,
        enableGridMenu: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        showGridFooter: true,
        onRegisterApi: function (gridApi) {
            vm.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
                if (rowEntity.Req < rowEntity.qmin) rowEntity.Req = rowEntity.qmin;
                if (rowEntity.Req > rowEntity.qmax) rowEntity.Req = rowEntity.qmax;

                $http({
                    method: 'GET',
                    url: '/api/updaterq/' + rowEntity.Ph_ID + "/" + rowEntity.GrCode + "/" + rowEntity.Req
                }).
                    then(function (response) {
                        vm.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                        $scope.$apply();
                        //vm.gridOptions.data = response.data;
                    }, function (data, status, headers, config) {
                        $scope.Result = 'Error!';
                    });
            });
         //   gridApi.selection.on.rowSelectionChanged($scope, function (row) {
//
//              exchange.grid = row.entity.Gr_ID;
//                exchange.grname = row.entity.Gr_Name;
//                exchange.phname = row.entity.Ph_Name;
//                exchange.pharmid = row.entity.Ph_ID;
//            });
        },
        columnDefs: [
            { name: 'ГрКод', field: 'GrCode', enableCellEdit: false, type: 'number' },
            { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false },
            {
                name: 'Заявка', field: 'Req', enableCellEdit: true, type: 'number', cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                    if (row.entity.MP === 0) {
                        return 'red';
                    }
                }
            },
            { name: 'Диапазон', field: 'Range', enableCellEdit: false, type: 'number' },
            { name: 'Кратность', field: 'Ratio', enableCellEdit: false, type: 'number' },
            { name: 'Мин Запас', field: 'MinQty', enableCellEdit: false, type: 'number' },
            { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: false, type: 'number' },
            { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number' },
            { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number' },
            { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number' },
            { name: 'Цена закупки', field: 'PriceIn', enableCellEdit: false, type: 'number' },
            { name: 'Цена продажи', field: 'PriceOut', enableCellEdit: false, type: 'number' }
        ]
    };

    //$http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
    //  .then(function(response) {
    //    vm.gridOptions.data = response.data;
    //    });

    $scope.onClick = function () {
        if (!vm.exchange.pharmid) {
            vm.exchange.pharmid = 0;
        }
        if (!vm.exchange.grid) {
            vm.exchange.grid = 0;
        }
        $scope.loading = true;
        $http({
            method: 'GET',
            url: '/api/ResultMtrxa/' + vm.exchange.pharmid + '/' + vm.exchange.grid
        }).
            then(function (response) {
                //           var data = response.data;
                //           for (var i = 0; i < 6; i++) {
                //               data = data.concat(data);
                //           }
                vm.gridOptions.data = response.data;
                $scope.loading = false;
                // $scope.loadMore();
            }, function (data, status, headers, config) {
                $scope.Resulta = 'Error!';
            });

    }
    $scope.onaccept = function (phaольгаrm, $index) {
        //
        $scope.rsp = '/api/acceptmx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
        $http({
            method: 'GET',
            url: '/api/acceptmx/' + pharm.Ph_ID + "/" + pharm.Gr_ID
        }).
            then(function (response) {
                $scope.rsp = response.data;
                $scope.mtrx.splice($index, 1);
            }, function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });
    };
    $scope.ondelete = function (pharm, $index) {

        //
        $scope.rsp = "удаление" + $index;
        $scope.rsp = '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
        $http({
            method: 'GET',
            url: '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID
        }).
            then(function (response) {
                $scope.rsp = response.data;
            },
            function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });
        $scope.mtrx.splice($index, 1);
    };
    $scope.oncreate = function (pharm, $index) {
        //
        $scope.rsp = "добавление";
        $scope.checkadd = !$scope.checkadd;
        $scope.rsp = $scope.newgrpcode;
        if (!$scope.checkadd) {
            $http({
                method: 'GET',
                url: '/api/addmx/' + $scope.newphcode + "/" + $scope.newgrpcode
            }).
                then(function (response) {
                    $scope.rsp = response.data;
                },
                function (data, status, headers, config) {
                    $scope.Result = 'Error!';
                });
        }
    };

    $scope.onSearch = function () {
        if (!$scope.searchPh) {
            $scope.searchPh = 0;
        }
        if (!$scope.searchGrp) {
            $scope.searchGrp = 0;
        }
        $http({
            method: 'GET',
            url: '/api/resultmtrxacc'
        }).
            then(function (response) {
                vm.gridOptions.data = response.data;
                // $scope.loadMore();
            }, function (data, status, headers, config) {
                $scope.Resulta = 'Error!';
            });

    }
    $scope.onstat = function () {
        //   exchange.pharmid = 1;
        //   exchange.grid = 1;
        //   exchange.phname = 'testph';
        //   exchange.grname = 'testgr';
        $location.path('/view13');
    }      
    $scope.OnSend = function () {
        $http({
            method: 'GET',
            url: '/api/send/' + $scope.pharmid
        }).
            then(function (response) {
                $scope.rsp = response.data;
            }, function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });
        $location.path('/');
    };
    $scope.onedit = function (pharm, $index) {
        //  $scope.rsp = 'Editing' + $index+ $scope.rq[$index].GrCode;
        if (!pharm.Req) pharm.Req = 0;
        $scope.rsp = '/api/updaterq/' + pharm.Ph_ID + "/" + pharm.GrCode + "/" + pharm.Req;
        //$scope.rsp = pharm.Gr_Name;
        console.log(pharm);
        $scope.editable = false;
        if (pharm.Req > pharm.qmax) pharm.Req = pharm.qmax;
        if (pharm.Req < pharm.qmin) pharm.Req = pharm.qmin;
        $http({
            method: 'GET',
            url: '/api/updaterq/' + pharm.Ph_ID + "/" + pharm.GrCode + "/" + pharm.Req
        }).
            then(function (response) {
                $scope.rsp = response.data;
            }, function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });
    };
    $http({
        method: 'GET',
        url: '/api/ResultRq/' + vm.exchange.pharmid
    }).
        then(function (response) {
            if (response.data.length > 0) {
                $scope.sent = response.data[0].sent > 0;
                if ($scope.sent) {
                    vm.gridOptions.columnDefs[2].enableCellEdit = false;
                };
            };
            vm.gridOptions.data = response.data;
        }, function (data, status, headers, config) {
            $scope.Result = 'Error!';
        });

}]);
app.controller('MyCtrl5', ['$scope', '$http', '$location', '$rootScope', 'exchange', 'i18nService', function ($scope, $http, $location, $rootScope, exchange,i18nService) {
    //$scope.exfac = exchange;
    $scope.pharmname = 'Тестовая аптека';
    $scope.pharmid = 1;
    $scope.exchange = exchange;
    $scope.clickph = function (pharm, $index) {
        $scope.pharmid = $scope.pharms[$index].Ph_ID;
        $scope.pharmname = $scope.pharms[$index].Ph_Name;
        $rootScope.pharmid = $scope.pharms[$index].Ph_ID;
        $rootScope.pharmname = $scope.pharms[$index].Ph_Name;
        $scope.exchange.pharmid = $scope.pharms[$index].Ph_ID;
        $scope.exchange.phname = $scope.pharms[$index].Ph_Name;
        $location.path('/view4');
    };
    $http({
        method: 'GET',
        url: '/api/result'
    }).
        then(function (response) {
            $scope.pharms = response.data;
        }, function (error) {
            $scope.result = 'Error!';
        });

}]);
app.controller('MyCtrl7', ['$scope', '$http', '$interval', 'uiGridConstants', '$rootScope', '$location', 'exchange', 'i18nService', function ($scope, $http, $interval, uiGridConstants, $rootScope, $location, exchange,i18nService) {
    var vm = this;
    vm.msg = {};
    i18nService.setCurrentLang('ru');
    vm.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        MultiSelect: false,
        exporterMenuCsv: true,
        enableGridMenu: true,
//        expandableRowTemplate: 'expandableRowTemplate.html',
//        expandableRowHeight: 450,
       onRegisterApi: function (gridApi) {
              vm.gridApi = gridApi;
//            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
//                if (row.isExpanded) {
//                    row.entity.subGridOptions = {
//                        columnDefs: [
//                            { name: 'Наименование', field:'RGG_Name' },
//                            { name: 'Количество', field:'RequestB_Quantity' },
//                            { name: 'В заказе' ,field:'OrderB_Quantity'},
//                            { name: "Поставщик", field:'Contractor_Name' },
//                            { name: "В накладной", field:'Invoice_Number'},
//                            { name: "В отказе", field: 'Refuse_Qty'},
//                            { name: "Оприходовано", field: 'Receive_id'}
//                        ]
//                    };
//
 //                   $http.get('/api/request/' + row.entity.Request_ID)
  //                      .then(function (response) {
 //                           row.entity.subGridOptions.data = response.data;
 //                       });
 //               }
 //           });
        },
        columnDefs: [
            { name: "Код", field: "Request_ID", grouping: { groupPriority: 1 }, sort: { priority: 1, direction: 'desc' } },
            { name: "Статус", field: "State_Name"},
            { name: "Дата", field: "R_date",grouping: { groupPriority: 0 }, sort: { priority: 0, direction: 'desc' } },
            { name: "Источник", field: "Request_Generation_Method" },
            { name: "Комментарий", field: "Comments", type: 'number' },
            { name: 'Наименование', field:'Gr_Name' },
            { name: 'Количество', field:'RequestB_Quantity' },
            { name: 'В заказе' ,field:'OrderB_Quantity'},
            { name: "Поставщик", field:'Contractor_Name' },
            { name: "В накладной", field:'Invoice_Number'},
            { name: "В отказе", field: 'Refuse_Qty'},
            { name: "Оприходовано", field: 'Receive_id'}
       ]
    };
    vm.exchange = exchange;
    vm.onmatrix = function () {
        //  exchange.pharmid = 1;
        exchange.grid = 0;
        //   exchange.phname = 'testph';
        exchange.grname = '';
        $location.path('/view12');
    }

    $http({
        method: 'GET',
        url: '/api/request/' + exchange.pharmid
    }).
        then(function (response) {
            vm.gridOptions.data = response.data;
        }, function (data, status, headers, config) {
            $scope.result = 'Error!';

        });


}]);
app.controller('MyCtrl12', ['$scope', '$http', '$interval', 'uiGridConstants', '$rootScope', '$location', 'exchange', 'i18nService','save12','$cookies', function ($scope, $http, $interval, uiGridConstants, $rootScope, $location, exchange, i18nService,save12,$cookies) {
  var vm = this;
  vm.msg = {};
  vm.exchange = exchange;
  vm.matrix = false;
  vm.matrixlabel = "Все";
  $scope.checkadd = false;
  i18nService.setCurrentLang('ru');
  vm.gridOptions = {
      enableFiltering: true,
      enableEditing: true,
      exporterMenuCsv: true,
      enableGridMenu: true,
//      enableRowSelection: true,
      enableRowHeaderSelection:true,
      multiSelect: false,
      showGridFooter: true,
      enableCellEditOnFocus:true,
      onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
              //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
              if (newValue != oldValue)
                  $http.post('/api/updatemx/', rowEntity).
                      then(function (response) {
                          vm.msg.lastCellEdited = 'Изменено строка:' + rowEntity.Gr_ID + ' Столбец:' + colDef.name + ' Было:' + newValue + ' Стало:' + oldValue;
                          $scope.$apply();
                          //vm.gridOptions.data = response.data;
                      }, function (data, status, headers, config) {
                          $scope.Result = 'Error!';
                      });
          });
          gridApi.selection.on.rowSelectionChanged($scope, function (row) {
              
              exchange.grid = row.entity.Gr_ID;
              exchange.grname = row.entity.Gr_Name;
              exchange.phname = row.entity.Ph_Name;
              exchange.pharmid = row.entity.Ph_ID;
              exchange.entity = row.entity;
          });
          gridApi.colMovable.on.columnPositionChanged($scope, saveState);
          gridApi.colResizable.on.columnSizeChanged($scope, saveState);
//          gridApi.grouping.on.aggregationChanged($scope, saveState);
//          gridApi.grouping.on.groupingChanged($scope, saveState);
          gridApi.core.on.columnVisibilityChanged($scope, saveState);
          gridApi.core.on.filterChanged($scope, saveState);
          gridApi.core.on.sortChanged($scope, saveState);
          restoreState();
    },
    columnDefs: [
        { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number' },
      { name: 'Наименование', field:'Gr_Name',width:'30%', enableCellEdit:false },
      { name: 'Код', field: 'Ph_ID', enableCellEdit: false, type:'number' },
      { name: 'Аптека', field: 'Ph_Name', width: '20%', enableCellEdit: false },
      { name: 'Кратность', field: 'Ratio', enableCellEdit: true, type: 'number'},
      { name: 'Мин Запас', field: 'MinQty', enableCellEdit: true, type: 'number'},
      { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: true, type: 'number' },
      { name: 'Врем Заказ', field: 'TempReq', enableCellEdit: true, type: 'number' },
      { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number'},
      { name: 'Остаток', field:'Ost', enableCellEdit: false,type: 'number' },
      { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number' },
      { name: 'Матрица', field: 'Matrix', enableCellEdit: true },
      { name: 'Рейтинг', field: 'Rating', enableCellEdit: true},
      { name: 'Маркетинг', field: 'Marketing', enableCellEdit: true },
      { name: 'Сезон', field: 'Season', enableCellEdit: true },
      { name: 'Тип товара', field: 'RGT_agg', enableCellEdit: false },
      { name: 'Фармгруппа', field: 'RFG_agg', enableCellEdit: false },
      { name: 'ПКУ', field: 'PKU_agg', enableCellEdit: false, type: 'number' }
  ]
  };

  //$http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
  //  .then(function(response) {
  //    vm.gridOptions.data = response.data;
  //    });

  $scope.onClick = function () {
      if (!vm.exchange.pharmid) {
          vm.exchange.pharmid = 0;
      }
      if (!vm.exchange.grid) {
          vm.exchange.grid = 0;
      }
      $scope.loading = true;
      if (vm.matrix) {
          vm.gridOptions.columnDefs = [
              { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number',allowCellFocus:false },
              { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false, allowCellFocus: false },
              { name: 'Код', field: 'Ph_ID', enableCellEdit: false, type: 'number', allowCellFocus: false},
              { name: 'Аптека', field: 'Ph_Name', width: '20%', enableCellEdit: false, allowCellFocus: false},
              { name: 'Кратность', field: 'Ratio', enableCellEdit: true, type: 'number' },
              { name: 'Мин Запас', field: 'MinQty', enableCellEdit: true, type: 'number' },
              { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: true, type: 'number' },
              { name: 'Врем Заказ', field: 'TempReq', enableCellEdit: true, type: 'number' },
              { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number' },
              { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number' },
              { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number' },
              { name: 'Заказано', field: 'Req', enableCellEdit: false, type: 'number' },
              { name: 'Матрица', field: 'Matrix', enableCellEdit: true },
              { name: 'Рейтинг', field: 'Rating', enableCellEdit: true },
              { name: 'Маркетинг', field: 'Marketing', enableCellEdit: true },
              { name: 'Сезон', field: 'Season', enableCellEdit: true },
              { name: 'Тип товара', field: 'RGT_agg', enableCellEdit: false },
              { name: 'Фармгруппа', field: 'RFG_agg', enableCellEdit: false },
              { name: 'ПКУ', field: 'PKU_agg', enableCellEdit: false, type: 'number' }
          ];
          $http.post('/api/ResultMtrxa/', {
              pharmid: vm.exchange.pharmid, grid: vm.exchange.grid
          }).
              then(function (response) {
                  //           var data = response.data;
                  //           for (var i = 0; i < 6; i++) {
                  //               data = data.concat(data);
                  //           }
                  vm.gridOptions.data = response.data;
                  restoreState();
                  $scope.loading = false;
                  // $scope.loadMore();
              }, function (data, status, headers, config) {
                  $scope.Resulta = 'Error!';
              });
      } else {
          vm.gridOptions.columnDefs = [
              { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number', allowCellFocus: false },
              { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false, allowCellFocus: false },
              { name: 'Код', field: 'Ph_ID', enableCellEdit: false, type: 'number', allowCellFocus: false},
              { name: 'Аптека', field: 'Ph_Name', width: '20%', enableCellEdit: false, allowCellFocus: false},
              { name: 'М', field: 'M', enableCellEdit: false, type: 'number' },
              { name: 'Кратность', field: 'Ratio', enableCellEdit: true, type: 'number' },
              { name: 'Мин Запас', field: 'MinQty', enableCellEdit: true, type: 'number' },
              { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: true, type: 'number' },
              { name: 'Врем Заказ', field: 'TempReq', enableCellEdit: true, type: 'number' },
              { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number' },
              { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number' },
              { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number' },
              { name: 'Заказано', field: 'Req', enableCellEdit: false, type: 'number' },
              { name: 'Матрица', field: 'Matrix', enableCellEdit: true },
              { name: 'Рейтинг', field: 'Rating', enableCellEdit: true },
              { name: 'Маркетинг', field: 'Marketing', enableCellEdit: true },
              { name: 'Сезон', field: 'Season', enableCellEdit: true },
              { name: 'Тип товара', field: 'RGT_agg', enableCellEdit: false },
              { name: 'Фармгруппа', field: 'RFG_agg', enableCellEdit: false },
              { name: 'ПКУ', field: 'PKU_agg', enableCellEdit: false, type: 'number' }
          ]
          $http.post('/api/ResultMtrxn/', {
              pharmid: vm.exchange.pharmid, grid: vm.exchange.grid
          }).
              then(function (response) {
                  //           var data = response.data;
                  //           for (var i = 0; i < 6; i++) {
                  //               data = data.concat(data);
                  //           }
                  vm.gridOptions.data = response.data;
                  restoreState();
                  $scope.loading = false;
                  // $scope.loadMore();
              }, function (data, status, headers, config) {
                  $scope.Resulta = 'Error!';
              });

      }
  }
  $scope.onedit = function (pharm, $index) {
      //
      $scope.rsp = '/api/updatemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID + "/" + pharm.MinQty + "/" + pharm.MinReq + "/" + pharm.Ratio;
      pharm.MinQty = pharm.MinQty.replace(",", ".");
      $http({
          method: 'GET',
          url: '/api/updatemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID + "/" + pharm.MinQty + "/" + pharm.MinReq + "/" + pharm.Ratio
      }).
          then(function (response) {
              vm.gridOptions.data = response.data;
          }, function (data, status, headers, config) {
              $scope.Result = 'Error!';
          });
  };
  $scope.onaccept = function (phаrm, $index) {
      //
      $scope.rsp = '/api/acceptmx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
      $http({
          method: 'GET',
          url: '/api/acceptmx/' + pharm.Ph_ID + "/" + pharm.Gr_ID
      }).
          then(function (response) {
              $scope.rsp = response.data;
              $scope.mtrx.splice($index, 1);
          }, function (data, status, headers, config) {
              $scope.Result = 'Error!';
          });
  };
  $scope.onDelete = function () {

      //
      $scope.rsp = "удаление" + vm.exchange.Gr_Name;
     // $scope.rsp = '/api/deletemx/' + exchange.Ph_ID + "/" + exchange.Gr_ID;
      $http.post('/api/deletemx/' ,exchange.entity).
          then(function (response) {
             vm.gridOptions.data[vm.gridOptions.data.indexOf(exchange.entity)] = response.data;
      },
          function (data, status, headers, config) {
              $scope.Result = 'Error!';
          });
  //    vm.GridOptions.data.splice(GridOptions.data.splice.indexOf(vm.exchange.entity), 1);
  };
  $scope.onAdd = function (pharm, $index) {
      //
      $scope.rsp = "добавление";
 //     $scope.checkadd = !$scope.checkadd;
      console.log(vm.gridOptions.data.indexOf(exchange.entity));
      console.log(vm.gridOptions.data[vm.gridOptions.data.indexOf(exchange.entity)])
      if (exchange.entity.M == 'Н') {
          $http.post('/api/addmx/',  exchange.entity).
              then(function (response) {
                  vm.gridOptions.data[vm.gridOptions.data.indexOf(exchange.entity)] = response.data;
                  
              },
              function (data, status, headers, config) {
                  $scope.Result = 'Error!';
              });
      }
  };

  $scope.onSearch = function () {
      if (!$scope.searchPh) {
          $scope.searchPh = 0;
      }
      if (!$scope.searchGrp) {
          $scope.searchGrp = 0;
      }
      $http({
          method: 'GET',
          url: '/api/resultmtrxacc'
      }).
          then(function (response) {
              vm.gridOptions.data = response.data;
              // $scope.loadMore();
          }, function (data, status, headers, config) {
              $scope.Resulta = 'Error!';
          });

  }
  $scope.onstat = function () {
   //   exchange.pharmid = 1;
   //   exchange.grid = 1;
   //   exchange.phname = 'testph';
   //   exchange.grname = 'testgr';
      $location.path('/view13');
  }  
  if ((vm.exchange.pharmid != 0)) {
      $scope.onClick();
  };
  $scope.onCheck = function () {
      vm.matrixlabel = vm.matrix ? "Все":"Матрица" ;
  }
  $scope.onSaveState = function () {
      save12.savestate = vm.gridApi.saveState.save();
      $cookies.put('gridState12', save12.savestate)
  };
//  $scope.$on('$routeChangeStart', function () {
//      console.log('location12', $location.path());
//      save12.savestate = vm.gridApi.saveState.save();
//      save12.data = vm.gridOptions.data;
//  });
  function saveState() {
      var state = $scope.gridApi.saveState.save();
      $cookies.put('gridState12', JSON.stringify(state));
    //  $scope.rsp = state;
  }
  function restoreState() {
      if ($cookies.get('gridState12')) {
          var restorestate = JSON.parse($cookies.get('gridState12'));
          if ($scope.gridApi) $scope.gridApi.saveState.restore( $scope, restorestate );
      };


  }
  $scope.onrestore = function () {
      restoreState();
  }
 //restoreState()
}]);
app.controller('MyCtrl11', ['$scope', '$http', '$interval', 'uiGridConstants', '$rootScope', '$location', 'exchange', 'i18nService','save11','$cookies', function ($scope, $http, $interval, uiGridConstants, $rootScope, $location, exchange, i18nService,save11,$cookies) {
    var vm = this;
    vm.msg = { };
    i18nService.setCurrentLang('ru');
    vm.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        MultiSelect: false,
        enableCellEditOnFocus: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
                $http({
                    method: 'GET',
                    url: '/api/updateph/' + rowEntity.Ph_ID + "/" + rowEntity.D_D + "/" + rowEntity.D_A + "/" + rowEntity.D_T + "/" + rowEntity.Kmin + "/" + rowEntity.Kmax
                }).
                    then(function (response) {
                        vm.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                        $scope.$apply();
                        //vm.gridOptions.data = response.data;
                    }, function (data, status, headers, config) {
                        $scope.Result = 'Error!';
                    });
            })
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                exchange.phname = row.entity.Ph_Name;
                exchange.pharmid = row.entity.Ph_ID;
            });
            gridApi.colMovable.on.columnPositionChanged($scope, saveState);
            gridApi.colResizable.on.columnSizeChanged($scope, saveState);
            //          gridApi.grouping.on.aggregationChanged($scope, saveState);
            //          gridApi.grouping.on.groupingChanged($scope, saveState);
            gridApi.core.on.columnVisibilityChanged($scope, saveState);
            gridApi.core.on.filterChanged($scope, saveState);
            gridApi.core.on.sortChanged($scope, saveState);
            restoreState();
       },
        columnDefs: [
            { name: "Код", field: "Ph_ID" , enableCellEdit:false},
            { name: "Наименование", field: "Ph_Name", width: "30%", enableCellEdit: false },
            { name: "Филиал", field: "Filial", enableCellEdit: false},
            { name: "Тип", field: "Type", enableCellEdit: false},
            { name: "Страховой запас", field: "D_A", type: "number",  enableCellEdit: true},
            { name: "Дней доставки", field: "D_D", type: "number", enableCellEdit: true },
            { name: "Дней продаж", field: "D_T", type: "number", enableCellEdit: true},
            { name: "Kmin", field: "Kmin", type: "number", enableCellEdit: true },
            { name: "Kmax", field: "Kmax", type: "number", enableCellEdit: true },
            { name: "Категория", field: "Categories", enableCellEdit: true}
        ]
    };
    vm.exchange = exchange;
    vm.onmatrix = function () {
         //  exchange.pharmid = 1;
           exchange.grid = 0;
        //   exchange.phname = 'testph';
           exchange.grname = '';
        $location.path('/view12');
    }
    $scope.loading = true;
    $http({
        method: 'GET',
        url: '/api/Result'
    }).
        then(function (response) {
            vm.gridOptions.data = response.data;
            restoreState();
            $scope.loading = false;
        }, function (data, status, headers, config) {
            $scope.result = 'Error!';

        });
 //   $scope.$on('$routeChangeStart', function () {
 //       console.log('location11', $location.path());
 //   });
    function saveState() {
        var state = $scope.gridApi.saveState.save();
        $cookies.put('gridState11', JSON.stringify(state));
  //      $scope.rsp = state;
    }
    function restoreState() {
        if ($cookies.get('gridState11')) {
            var restorestate = JSON.parse($cookies.get('gridState11'));
            if ($scope.gridApi) $scope.gridApi.saveState.restore($scope, restorestate);
        };


    }
    $scope.onrestore = function () {
        restoreState();
    }

//    restoreState();
}]);
app.controller('MyCtrl13', function ($scope, $http,$rootScope,exchange,save13) {
    var vm = this;
    $scope.exchange = exchange;
    $scope.colors = ['#00ffff', '#007f00', '#0000ff', '#7f7f00', '#ff0000', '#ff0000'];

    $scope.labels = [];
    $scope.data = [];
    $scope.data.push([]);
    $scope.data.push([]);
    $scope.data.push([]);

    $scope.onsearch = function () {
        $scope.loading = true;
        $http({
            method: 'GET',
            url: '/api/sales/' + $scope.exchange.pharmid + "/" + $scope.exchange.grid
        }).
            then(function (response) {
                $scope.myData = response.data;
                if ($scope.myData.length > 0) {
                    $scope.Ph_Name = $scope.exchange.phname;
                    $scope.Gr_Name = $scope.exchange.grname;
                }
                $scope.labels = [];
                $scope.data = [];
                $scope.data.push([]);
                $scope.data.push([]);
                $scope.data.push([]);
                $scope.data.push([]);
                $scope.data.push([]);
                $scope.data.push([]);
                for (var i = 0; i < $scope.myData.length - 1; i++) {
                    $scope.labels.push($scope.myData[i].dat)
                    $scope.data[0].push($scope.myData[i].Ost)
                    $scope.data[1].push($scope.myData[i].Qty)
                    $scope.data[2].push($scope.myData[i].Sal)
                    $scope.data[3].push($scope.myData[i].Rec)
                    $scope.data[4].push($scope.myData[i].Vel)
                    if ($scope.myData[i].Req > 0)
                        $scope.data[5].push(0)
                    else
                        $scope.data[5].push(NaN);
                    $scope.loading = false;
                }

            }, function (data, status, headers, config) {
                $scope.result = 'Error!';

            });

    };
    $scope.options = {
        legend: {
            display: true,
            position: 'bottom'
        },
        elements: {
            line: {
                tension:0,
            }
        }
    };
    $scope.series = ["Остатки", "Мин Запас", "Продажи", "Приходы", "Скорость", "Заказ"];
    $scope.datasetOverride = [
        {
            label: "Остатки",
            borderWidth: 1,
            type: 'line',
            fill: false,
            pointRadius:0
        },
        {
            label: "Мин Запас",
            borderWidth: 1,
            type: 'line',
            fill: false,
            pointRadius: 0

        },
        {
            label: "Продажи",
            borderWidth: 1,
            type: 'line',
            fill: false,
            pointRadius: 0

        },
        {
            label: "Приходы",
            borderWidth: 1,
            type: 'line',
            fill: false,
            pointRadius: 0

        },
        {
            label: "Скорость",
            borderWidth: 1,
            type: 'line',
            fill: false,
            pointRadius: 0

        },
        {
            label: "Заказ",
            borderWidth: 1,
            type: 'line',
            fill: false,
            pointRadius: 10,
            pointStyle: 'triangle'

        }
    ];
    if (($scope.exchange.pharmid != 0) && ($scope.exchange.grid != 0)) {
        $scope.onsearch();
    };
});
app.factory('exchange', function () {
    return ({
        pharmid: 0,
        phname: '',
        grid: 0,
        grname: '',
        entity: {}
    })

});
app.factory('save11', function(){
    return({
        savestate: {},
        data: []
    })
});
app.factory('save12', function(){
    return({
        savestate: {},
        data: []
    })
});
app.factory('save13', function () {
    return ({
        savestate: {},
        data: []
    })
})

