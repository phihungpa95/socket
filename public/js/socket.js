let socket = io();

socket.emit('new user', window.location.hash.replace('#', ''), function (flag) {
    console.log(flag)
})

socket.on('list all user', function (list) {
    for (let i in list) {
        if (i !== window.location.hash.replace('#', '')) {
            $('.contact-list').append(`<li id="${i}" class="person chatboxhead active" id="chatbox1_Deven" data-chat="person_1" href="javascript:void(0)" onclick="javascript:chatWith('Deven','1','deven.jpg','Online')">
                <a href="javascript:void(0)">
                    <span class="userimage profile-picture min-profile-picture"><img src="storage/user_image/Deven.jpg" alt="Deven" class="avatar-image is-loaded bg-theme" width="100%"></span>
                    <span>
                        <span class="bname personName">${i}</span>
                        <span class="personStatus"><span class="time Online"><i class="fa fa-circle" aria-hidden="true"></i></span></span>
                        <span class="count"><span class="icon-meta unread-count">2</span></span><br>
                        <small class="preview"><span class="Online">Online</span></small>
                    </span>
                </a>
            </li>`)
        }
    }
})

socket.on('new user', function (name) {
    $('.contact-list').append(`<li id="${name}" class="person chatboxhead active" id="chatbox1_Deven" data-chat="person_1" href="javascript:void(0)" onclick="javascript:chatWith('Deven','1','deven.jpg','Online')">
        <a href="javascript:void(0)">
            <span class="userimage profile-picture min-profile-picture"><img src="storage/user_image/Deven.jpg" alt="Deven" class="avatar-image is-loaded bg-theme" width="100%"></span>
            <span>
                <span class="bname personName">${name}</span>
                <span class="personStatus"><span class="time Online"><i class="fa fa-circle" aria-hidden="true"></i></span></span>
                <span class="count"><span class="icon-meta unread-count">2</span></span><br>
                <small class="preview"><span class="Online">Online</span></small>
            </span>
        </a>
    </li>`)
})

socket.on('delete user', function (name) {
    $('#' + name).remove();
})


// document.getElementById('message').addEventListener('keypress', function (e) {
//     if (e.which == 13) {
//         console.log(this.value)
//         // socket.emit('send message', )
//     }
// })


function clickTosendMessage(chatboxtitle, toid, img) {

    message = $(".chatboxtextarea").val();

    message = message.replace(/^\s+|\s+$/g, "");

    $(".chatboxtextarea").val('');
    $(".chatboxtextarea").focus();
    $(".input-placeholder").css({ 'visibility': 'visible' });
    $(".chatboxtextarea").css('height', '20px');
    if (message != '') {

        message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
        message = message.replace(/\n/g, "<br />");
        var $con = message;
        var $words = $con.split(' ');
        for (i in $words) {
            if ($words[i].indexOf('http://') == 0 || $words[i].indexOf('https://') == 0) {
                $words[i] = '<a href="' + $words[i] + '">' + $words[i] + '</a>';
            }
            else if ($words[i].indexOf('www') == 0) {
                $words[i] = '<a href="' + $words[i] + '">' + $words[i] + '</a>';
            }
        }
        message = $words.join(' ');
        message = emojione.shortnameToImage(message);  // Set imotions

        $("#chatbox_" + chatboxtitle).append('<div class="col-xs-12 p-b-10 odd">' +
            '<div class="chat-image  profile-picture max-profile-picture">' +
            '<img alt="' + username + '" src="storage/user_image/' + Ses_img + '">' +
            '</div>' +
            '<div class="chat-body">' +
            '<div class="chat-text">' +
            '<h4>' + username + '</h4>' +
            '<p>' + message + '</p>' +
            '<b>Just Now</b><span class="msg-status msg-' + chatboxtitle + '"><i class="fa fa-check"></i></span>' +
            '</div>' +
            '</div>' +
            '</div>');

        $(".target-emoji").css({ 'display': 'none' });
        $('.wchat-filler').css({ 'height': 0 + 'px' });

        socket.emit('send message', message, toid)
        scrollDown();
    }



    var adjustedHeight = $(".chatboxtextarea").clientHeight;
    var maxHeight = 40;

    if (maxHeight > adjustedHeight) {
        adjustedHeight = Math.max($(".chatboxtextarea").scrollHeight, adjustedHeight);
        if (maxHeight)
            adjustedHeight = Math.min(maxHeight, adjustedHeight);
        if (adjustedHeight > $(".chatboxtextarea").clientHeight)
            $($(".chatboxtextarea")).css('height', adjustedHeight + 8 + 'px');
    } else {
        $($(".chatboxtextarea")).css('overflow', 'auto');
    }
    return false;
}