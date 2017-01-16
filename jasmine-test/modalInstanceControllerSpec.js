describe('modal instance controller', function () {
    var $rootScope, scope, model, $uibModalInstance;
    beforeEach(function () {
        module('shared');
    });
    beforeEach(inject(
        function($controller, _$rootScope_) {
            $rootScope = _$rootScope_;
            model = {header:'Are you sure?', body:'Really delete "Test Friend"?', btnConfirm:'Yes', btnCancel:'No', value:'Test Friend'};
            $uibModalInstance = jasmine.createSpyObj(['close', 'dismiss']);
            scope = $rootScope.$new();
            $controller('confirmModalInstanceController', {$scope:scope, $uibModalInstance:$uibModalInstance, model:model});
        }
    ));
    it('closes the instance with the value', function () {
        scope.confirm();
        expect($uibModalInstance.close).toHaveBeenCalledWith('Test Friend');
    });
    it('dismisses the instance', function () {
        scope.dismiss();
        expect($uibModalInstance.dismiss).toHaveBeenCalled();
    });
    it('makes the model accessible to the View', function () {
        expect(scope.model).toEqual(model);
    });
});