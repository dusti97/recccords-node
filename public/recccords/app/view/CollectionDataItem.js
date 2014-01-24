/*
 * File: app/view/CollectionDataItem.js
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

Ext.define('Recccords.view.CollectionDataItem', {
    extend: 'Ext.dataview.component.DataItem',
    alias: 'widget.collectionDataItem',

    requires: [
        'Ext.Img'
    ],

    config: {
        border: '',
        itemId: 'collectionItem',
        padding: 0,
        style: '',
        styleHtmlContent: true,
        layout: 'hbox',
        itemCls: 'photo',
        items: [
            {
                xtype: 'image',
                height: 90,
                id: '',
                itemId: 'img',
                padding: '0 10 0 0',
                width: 90
            },
            {
                xtype: 'component',
                flex: 1,
                html: 'Text',
                itemId: 'title',
                padding: '3 0 0 10'
            }
        ]
    },

    updateRecord: function(record) {
        // Provide an implementation to update this container's child items
        var me = this;
        if(record){
            me.down('#img').setSrc(record.get('recordThumb'));
            var titletxt = record.get('recordArtist')+'<br>'+record.get('recordName');
            if (titletxt.length > 120)
                titletxt = titletxt.substr(0,120);
            me.down('#title').setHtml(titletxt);

            me.callParent(arguments);
            //console.log("updateRecord "+record.get('recordThumb'));
        }


    }

});