/*
 * File: app/view/SignUpContainer.js
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

Ext.define('Phonogram.view.SignUpContainer', {
    extend: 'Ext.Container',
    alias: 'widget.signupcontainer',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Email',
        'Ext.field.Password',
        'Ext.Button'
    ],

    config: {
        layout: 'fit',
        items: [
            {
                xtype: 'formpanel',
                centered: false,
                id: 'signupForm',
                margin: 0,
                layout: 'fit',
                items: [
                    {
                        xtype: 'fieldset',
                        centered: false,
                        items: [
                            {
                                xtype: 'emailfield',
                                id: 'usernameSignupField',
                                margin: '20 10 20 10',
                                labelWidth: 120,
                                name: 'usernameSignupField',
                                placeHolder: 'username'
                            },
                            {
                                xtype: 'emailfield',
                                id: 'emailSignupField',
                                margin: '20 10 20 10',
                                labelWidth: 120,
                                name: 'emailSignupField',
                                placeHolder: 'email@example.com'
                            },
                            {
                                xtype: 'passwordfield',
                                id: 'passwordSignupField',
                                margin: '10 10 20 10 ',
                                name: 'passwordSignupField',
                                placeHolder: 'password'
                            },
                            {
                                xtype: 'button',
                                itemId: 'createAccountButton',
                                margin: 10,
                                minHeight: 50,
                                styleHtmlContent: true,
                                text: 'Create Account'
                            },
                            {
                                xtype: 'container',
                                html: '',
                                id: 'createAccountResponse',
                                margin: 10,
                                styleHtmlContent: true
                            }
                        ]
                    }
                ]
            }
        ]
    }

});