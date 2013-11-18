/*
 * File: app/model/Collection.js
 *
 * This file was generated by Sencha Architect version 2.2.3.
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

Ext.define('Recccords.model.Collection', {
    extend: 'Ext.data.Model',

    uses: [
        'Recccords.model.Release'
    ],

    config: {
        hasMany: {
            associatedName: 'releases',
            model: 'Recccords.model.Release'
        }
    }
});