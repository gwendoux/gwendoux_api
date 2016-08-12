const moment = require('moment');

function filterDataByTag(result, tag) {
    return filterData(result.filter(function(photo) {
        return photo.tags.indexOf(tag) > -1;
    }));
}

function filterData(result) {
    // only return images not videos
    return result.filter(function(photo) {
        return photo.type.indexOf('image') > -1;
    }).map(function(photo) {
        return {
            image: {
                standard: photo.images.standard_resolution.url,
                thumbnail: photo.images.thumbnail.url,
                caption: photo.caption ? photo.caption.text : "",
                origlink: photo.link,
                date: moment(photo.created_time, 'X'),
                since: moment(photo.created_time, 'X').fromNow()
            },
            user: {
                username: photo.user.username,
                profile_picture: photo.user.profile_picture
            }
        };
    });
}


exports.filterDataByTag = filterDataByTag;
exports.filterData = filterData;
