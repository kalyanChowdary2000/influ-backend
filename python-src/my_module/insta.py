import instaloader
from flask import Flask, request, jsonify
from googleapiclient.discovery import build
app = Flask(__name__)

@app.route('/get_follower_count', methods=['POST'])
def get_follower_count():
    data = request.get_json()
    if 'username' not in data:
        return jsonify({'error': 'Please provide a username in the request body'}), 400
    username = data['username']
    bot = instaloader.Instaloader()
    try:
        profile = instaloader.Profile.from_username(bot.context, username)
    except Exception as e:
        return jsonify({'error': f'Error fetching profile: {str(e)}'}), 400
    followers_count = profile.followers
    response_data = {
        'username': username,
        'followers_count': followers_count
    }
    return jsonify(response_data)

@app.route('/get_instagram_bio', methods=['POST'])
def get_instagram_bio():
    data = request.get_json()
    if 'username' not in data:
        return jsonify({'error': 'Please provide a username in the request body'}), 400
    username = data['username']
    bot = instaloader.Instaloader()
    
    try:
        profile = instaloader.Profile.from_username(bot.context, username)
    except Exception as e:
        return jsonify({'error': f'Error fetching profile: {str(e)}'}), 400

    bio = profile.biography
    
    response_data = {
        'username': username,
        'bio': bio
    }

    return jsonify(response_data)
@app.route('/get_engagement_rate', methods=['POST'])
def get_engagement_rate():
    data = request.get_json()
    if 'username' not in data:
        return jsonify({'error': 'Please provide a username in the request body'}), 400
    username = data['username'];
    print("Username is ",username);
    bot = instaloader.Instaloader()
    try:
        profile = instaloader.Profile.from_username(bot.context, username)
    except Exception as e:
        return jsonify({'error': f'Error fetching profile: {str(e)}'}), 400
    posts = profile.get_posts()
    print("--------------------",profile.mediacount)
    if(profile.mediacount==0):
        response_data = {
        'username': username,
        'engagement_rate': 0,
        'followers_count':profile.followers
        }
        return jsonify(response_data)
    if(profile.mediacount>0 and profile.mediacount<10):
        postLimit=profile.mediacount
    else:
        postLimit=round(profile.mediacount*0.1)
    c=0
    p=0
    l=0
    print("post limit is ",postLimit)
    for index, post in enumerate(posts, 1):
        c=c+post.likes+post.comments+post.comments/2+post.comments/4
        l=l+post.likes
        p=p+1
        print(post.likes)
        if(p==postLimit):
            break;
    reach=c/postLimit;
    print("sun is",c,"no of post are",postLimit)
    print("reach is ",reach);
    er=(reach/profile.followers)*100;
    print("engagement rate is ",er)
    response_data = {
        'username': username,
        'engagement_rate': er,
        'followers_count':profile.followers
    }
    return jsonify(response_data)
@app.route('/get_youtube_bio', methods=['POST'])
def get_youtube_bio():
    data = request.get_json()
    print(data);
    if 'developerKey' not in data:
        return jsonify({'error': 'Please provide a username in the request body'}), 400
    developerKey=data['developerKey']
    channelId=data['channelId']
    youtube = build('youtube', 'v3',
				developerKey=developerKey)
    ch_request = youtube.channels().list(
	part='snippet',
	id=channelId)
    ch_response = ch_request.execute()
    description=ch_response['items'][0]['snippet']['description']
    response_data = {
        "channelId":channelId,
        "description":description,
        "customUrl":ch_response['items'][0]['snippet']['customUrl']
    }
    return jsonify(response_data)
@app.route('/get_yt_engagement_rate', methods=['POST'])
def get_yt_engagement_rate():
    data = request.get_json()
    print("-------------------------------------");
    print(data);
    try:
        if 'developerKey' not in data:
            return jsonify({'error': 'Please provide a username in the request body'}), 400
        developerKey=data['developerKey']
        channelId=data['channelId']
        youtube = build('youtube', 'v3',
	    			developerKey=developerKey)
        print("==============================");
        ch_request = youtube.channels().list(
	    part='snippet,statistics,contentDetails',
        id=channelId)
        ch_response = ch_request.execute()
        print(ch_response["items"])
        print("==============================");
        allUploadedVideosPlaylist =  ch_response["items"][0]['contentDetails']['relatedPlaylists']['uploads']
        videos = [ ]
        print("---------------------------------------------------------- video count ",ch_response['items'][0]['statistics']['videoCount'])
        if(int(ch_response['items'][0]['statistics']['videoCount'])==0):
             response_data = {
             "engagementRate":0,
             "subscriberCount":0,
             "customUrl":ch_response['items'][0]['snippet']['customUrl']
             };
             return jsonify(response_data)
        postCount=round(int(ch_response['items'][0]['statistics']['videoCount'])*0.1)
        if(int(ch_response['items'][0]['statistics']['videoCount'])<10 and int(ch_response['items'][0]['statistics']['videoCount'])>0):
            postCount=1

        next_page_token = None
        x=0;
        while True:
            playlistData = youtube.playlistItems().list(playlistId=allUploadedVideosPlaylist,
                                               part='snippet',
                                               pageToken=next_page_token).execute()
            videos += playlistData['items']
            next_page_token = playlistData.get('nextPageToken')

            if next_page_token is None:
                break
        print("\n\n\n\n\n");
        video_ids=[]  
        for i in range(len(videos)):
            video_ids.append(videos[i]["snippet"]["resourceId"]["videoId"])
            i+=1 
    except Exception as e:
        print("e");
    print(video_ids)
    print("\n\n\n\n\n");
    likes=0
    comments=0
    views=0
    videoStatistics = []
    impressions=0
    print(" post count is ",postCount)
    for i in range(postCount):
        videoData = youtube.videos().list(id=video_ids[i],part = "statistics").execute()
        videoStatistics.append(videoData["items"][0]["statistics"])
        print(videoData['items'][0]['statistics'])
    # Assuming videoData is a dictionary containing the JSON data
        video_item = videoData.get("items", [{}])[0]
        like_count = int(video_item.get("statistics", {}).get("likeCount", 0))
        likes=likes+like_count
        comment_count = int(video_item.get("statistics", {}).get("commentCount", 0))
        comments=comments+comment_count
        view_count = int(video_item.get("statistics", {}).get("viewCount", 0))
        views=views+view_count
        impressions = impressions + like_count + comment_count+view_count

    # impressions=impressions+int(videoData["items"][0]["statistics"]["likeCount"])+int(videoData["items"][0]["statistics"]["commentCount"])
        i+=1
    
# print(videoStatistics);
    print("\n\n\n\n\n");
    print(" post count is ",postCount)
    print("totoal impressions ",impressions);
    impressions=impressions+int(ch_response['items'][0]['statistics']['viewCount'])
    reach=impressions/postCount
    print("general reach is ",reach)
    er=reach/(int(ch_response['items'][0]['statistics']['subscriberCount']))
    print("totoal er is ",er)

    response_data = {
        "engagementRate":er,
        "subscriberCount":ch_response['items'][0]['statistics']['subscriberCount'],
        "customUrl":ch_response['items'][0]['snippet']['customUrl']
    }
    return jsonify(response_data)

@app.route('/get_latest_yt_video_info', methods=['POST'])
def get_latest_yt_video_info():
    data = request.get_json()
    
    if 'developerKey' not in data or 'channelId' not in data:
        return jsonify({'error': 'Please provide a developer key and channel ID in the request body'}), 400

    developerKey = data['developerKey']
    channelId = data['channelId']

    youtube = build('youtube', 'v3', developerKey=developerKey)
    ch_request = youtube.channels().list(
        part='contentDetails',
        id=channelId
    )
    ch_response = ch_request.execute()

    # Get the upload playlist of the channel
    allUploadedVideosPlaylist = ch_response["items"][0]['contentDetails']['relatedPlaylists']['uploads']

    # Retrieve the details of the latest video
    latest_video = youtube.playlistItems().list(
        playlistId=allUploadedVideosPlaylist,
        part='snippet',
        maxResults=1
    ).execute()

    if 'items' not in latest_video:
        return jsonify({'error': 'No videos found in the playlist'}), 400

    latest_video_info = latest_video['items'][0]['snippet']
    video_id = latest_video_info['resourceId']['videoId']
    video_title = latest_video_info['title']
    video_description = latest_video_info['description']
    response_data = {
        'video_id': video_id,
        'video_title': video_title,
        'description': video_description
    }

    return jsonify(response_data)
@app.route('/get_latest_insta_post_info', methods=['POST'])
def get_latest_insta_post_info():
    data = request.get_json()
    
    if 'username' not in data:
        return jsonify({'error': 'Please provide a developer key and channel ID in the request body'}), 400

    username = data['username']
    bot = instaloader.Instaloader()
#replace your instagram username where"yraveena_01"
# profile1=bot.interactive_login("kalyan_chowdary21")
    profile = instaloader.Profile.from_username(bot.context, username)
    posts = profile.get_posts()
    for index, post in enumerate(posts, 1):
        postData=post;
        break;
    response_data = {
        'shortcode':postData.shortcode,
        'description':postData.caption,  
    }

    return jsonify(response_data)

@app.route('/get_instagram_post_metrics', methods=['POST'])
def get_instagram_post_metrics():
    data = request.get_json()

    if 'username' not in data or 'shortcode' not in data:
        return jsonify({'error': 'Please provide a username and post URL in the request body'}), 400

    username = data['username']
    shortcode = data['shortcode']
    print(shortcode); 
    bot = instaloader.Instaloader()

    try:
        profile = instaloader.Profile.from_username(bot.context, username)
        posts=profile.get_posts();
        p1=''
        for index, post in enumerate(posts, 0):
            print(post)
            if post.shortcode==shortcode:
                p1=post
                break;
        #post = instaloader.Post.from_shortcode(bot.context, shortcode)  # Use from_url to fetch the post by its URL.
    except Exception as e:
        return jsonify({'error': f'Error fetching profile or post: {str(e)}'}), 400
    
    likes = p1.likes
    comments = p1.comments
    views=p1.video_view_count
    url=p1.url
    #shares = post_url  # Using the post URL as a unique identifier.

    response_data = {
        'username': username,
        'shortcode': shortcode,
        'likes': likes,
        'comments': comments,
        'views':views,
        'url':url
       # 'shares': shares
    }

    return jsonify(response_data)

@app.route('/get_youtube_video_metrics', methods=['POST'])
def get_youtube_video_metrics():
    data = request.get_json()

    if 'developerKey' not in data or 'videoId' not in data:
        return jsonify({'error': 'Please provide a developer key and video ID in the request body'}), 400

    developerKey = data['developerKey']
    videoId = data['videoId']

    youtube = build('youtube', 'v3', developerKey=developerKey)

    # Retrieve the details of the specified video using its unique video ID.
    video_response = youtube.videos().list(
        part='statistics',
        id=videoId
    ).execute()

    if 'items' not in video_response:
        return jsonify({'error': 'Video not found'}), 404

    video_stats = video_response['items'][0]['statistics']

    view_count = int(video_stats.get("viewCount", 0))
    like_count = int(video_stats.get("likeCount", 0))
    dislike_count = int(video_stats.get("dislikeCount", 0))
    comment_count = int(video_stats.get("commentCount", 0))

    response_data = {
        'videoId': videoId,
        'viewCount': view_count,
        'likeCount': like_count,
        'dislikeCount': dislike_count,
        'commentCount': comment_count
    }

    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=6061)