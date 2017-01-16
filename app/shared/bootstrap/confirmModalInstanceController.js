(
    function(){
        'use strict';
        angular.module('shared').controller('confirmModalInstanceController', [
                '$scope', '$uibModalInstance', 'model',
                confirmModalInstanceController
            ]);
        function confirmModalInstanceController($scope, $uibModalInstance, model) {
            $scope.model = model;
            $scope.confirm = function(){
                $uibModalInstance.close(model.value || '');
            }
            $scope.dismiss = function() {
                $uibModalInstance.dismiss();
            }
        }
    }
)();