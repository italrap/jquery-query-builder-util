# jQuery QueryBuilder Utility

Initialization library for jQuery QueryBuilder.
It also provides an extension to show:
   - editable labels
   - toggle to activate/deactivate rules and groups


## Usage

### Angularjs 
Per usarlo in angularjs:
   aggiungere il modulo nell'inizializzazione dell'app (file app.module.js)
   
```js
    angular
        .module('MyApp', [
    .....
            'QueryBuilderUtility',
    .....
        ])
```

### Angularjs global config
É possibile impostare una configurazione globale 

```js
    angular
        .module('MyApp', [
    .....
            'QueryBuilderUtility',
    .....
        ])
        .run(run);

    run.$inject = ['queryBuilderUtility'];

    function run(queryBuilderUtility) {
        queryBuilderUtility.globalConfig({
            labels: { visible: false, readonly: true },
            toggle: { visible: false },
        });
    }
```

### Angularjs usage
Per creare un oggetto querybuilder

```js
queryBuilderUtility.createQueryBuilder($('#builder-basic'), [item], {toggle:{visible:false}});
```

## 