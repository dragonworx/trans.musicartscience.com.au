var pstyle = 'border: 1px solid #dfdfdf; padding: 4px;';
$('#layout').w2layout({
    name: 'layout',
    padding: 4,
    panels: [
        { type: 'top', size: 50, resizable: false, style: pstyle, content: '<div id="layout-top"></div>' },
        { type: 'left', size: 200, resizable: true, style: pstyle, content: '<div id="layout-left"></div>' },
        { type: 'main', style: pstyle, content: '<div id="layout-main"></div>' },
        { type: 'right', size: 200, resizable: true, style: pstyle, content: '<div id="layout-right"></div>' },
        { type: 'bottom', size: 200, resizable: true, style: pstyle, content: '<div id="layout-bottom"></div>' }
    ]
});