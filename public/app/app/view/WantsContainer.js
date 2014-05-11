/*
 * File: app/view/WantsContainer.js
 *
 * This file was generated by Sencha Architect
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.3.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.3.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Phonogram.view.WantsContainer', {
    extend: 'Ext.Container',

    requires: [
        'Ext.Toolbar',
        'Ext.Button',
        'Ext.dataview.DataView'
    ],

    config: {
        id: 'CollectionContainer1',
        layout: 'hbox',
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                title: 'Wants',
                items: [
                    {
                        xtype: 'button',
                        border: '0 0 0 0',
                        id: 'collectionHomeButton1',
                        padding: '5 5 0 8',
                        iconCls: 'list',
                        text: ''
                    }
                ]
            },
            {
                xtype: 'container',
                flex: 1,
                layout: 'hbox',
                items: [
                    {
                        xtype: 'dataview',
                        flex: 1,
                        height: '100%',
                        id: 'wantItems',
                        style: 'background-color:white;',
                        width: '100%',
                        defaultType: 'collectionDataItem',
                        emptyText: 'no data',
                        useComponents: true
                    }
                ]
            }
        ],
        listeners: [
            {
                fn: 'onCollectionHomeButtonTap',
                event: 'tap',
                delegate: '#collectionHomeButton1'
            },
            {
                fn: 'onWantsContainerActivate',
                event: 'activate'
            }
        ]
    },

    onCollectionHomeButtonTap: function(button, e, eOpts) {
        var me = this;
        console.log('on serach home ');
        var homeView = Ext.create('Recccords.view.mainView', {

        });
        var subC = homeView.down("#subContainer");
         me.loggedInView = Ext.create('Recccords.view.LoggedInContainer', {
                title: 'Welcome to Recccords'
            });
        subC.push(me.loggedInView);
        var viewport = Ext.getCmp("viewport");
        viewport.removeAll();
        viewport.add(homeView);
    },

    onWantsContainerActivate: function(newActiveItem, container, oldActiveItem, eOpts) {
        console.log("onCollectionContainerInitialize");
        var me = this;
        successCB = function(result) {
            console.log("wantscallback " + result);
            var searchStore = Ext.data.Store({
            model: 'Recccords.model.CollectionItem',
            data: result
            }) ;
            console.log('count '+searchStore.totalCount);
            me.down('#wantItems').setStore(searchStore);

        };
        failCB = function(result){
            console.log("getWants failed error : "+result.error);
        };
        me.successCB = successCB;
        me.failCB = failCB;
        getWants(me.successCB,me.failCB);
    }

});