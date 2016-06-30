// parse json data
function parsePosts(redditPosts, tab) {
    var url = encodeURIComponent(tab.url);
    var title = tab.title;
    var submitUrl = "https://www.reddit.com/submit?url=" + url;
    var permalinks = [];
    var now = new Date();
    var date_now = new Date(now.getUTCFullYear(), now.getUTCMonth(),
        now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    var date_entry;
    var one_day = 86400000; // milliseconds per day
    var orangeRed = [255, 69, 0, 55];
    var green = [1, 220, 1, 255];

    $("#timeout").hide(0);

    $('#submit').toggle(!redditPosts.length).attr('href', submitUrl);

    chrome.browserAction.setBadgeBackgroundColor({
        "color": redditPosts.length ? green : orangeRed,
        "tabId": tab.id
    });
    chrome.browserAction.setBadgeText({
        "text": "" + redditPosts.length,
        "tabId": tab.id
    });


    for (var i = 0, entry; entry = redditPosts[i]; i++) {
        date_entry = new Date(entry.data.created_utc * 1000).getTime();
        permalinks[i] = {
            link: entry.data.permalink,
            title: entry.data.title,
            score: entry.data.score + "",
            age: (date_now - date_entry) / one_day,
            comments: entry.data.num_comments + "",
            subreddit: entry.data.subreddit
        };
    }

    // showPosts:
    var maxTitleLength = 30;
    var $data = $("#data");

    if (title.length > maxTitleLength) {
        title = title.substring(0, maxTitleLength) + "...";
    }
    $data.append("<span id='title'>" + title + "</span>&nbsp;&nbsp;&nbsp;");

    $.each(permalinks, function (index, permalink) {
        $("#links").append(
            "<li>" +
            "<div class='score'>" + permalink.score + "</div>" +
            " <a href='https://www.reddit.com" + permalink.link +
            "' title='" + permalink.link + "' target='_blank' >" +
            permalink.title + "</a>" +
            "<div class='age'>" + getAge(permalink.age) +
            " ,&nbsp;&nbsp;" + permalink.comments + " comments," +
            "&nbsp;&nbsp;r/" + permalink.subreddit +
            "</div>" +
            "</li>"
        );
    });
}

function getYoutubeURLs(url) {
    var gotVidId = false;
    var video_id = '';
    var urls = []
    if (url.indexOf('v=') != -1) {
        video_id = url.split('v=')[1];
        if (video_id != "")
            gotVidId = true;
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
    }
    if (gotVidId) {
        var httpUrl = 'http://www.youtube.com/watch?v=' + video_id
        if (httpUrl != url) {
            urls.push(httpUrl);
        }
        var httpsUrl = 'https://www.youtube.com/watch?v=' + video_id
        if (httpsUrl != url) {
            urls.push(httpsUrl);
        }
    }
    return urls;
}

function constructURLs(url) {
    if (url.indexOf('http') == -1) {
        return []
    }
    var urls = [url];
    if (url.indexOf('youtube.com') != -1) {
        urls = urls.concat(getYoutubeURLs(url));
    }
    return urls;
}

// get URL info json
function getURLInfo(tab) {
    var url = tab.url;
    var redditPosts = [];
    var urls = constructURLs(url);
    for (var i = 0; i < urls.length; ++i) {
        url = encodeURIComponent(urls[i]);
        $.getJSON('https://www.reddit.com/api/info.json?url=' + url, function (jsonData) {
            redditPosts = redditPosts.concat(jsonData.data.children);
            urls.shift();

            if (0 === urls.length) {
                parsePosts(redditPosts, tab);
            }
        });
    }
}

function getAge(days) {
    return days.toFixed(1) + " days ago";
}

document.addEventListener('DOMContentLoaded', function () {
    $("#close").click(function () {
        window.close();
    });
});

chrome.runtime.getBackgroundPage(function () {
    chrome.tabs.getSelected(null, function (tab) {
        getURLInfo(tab);
    });
});

