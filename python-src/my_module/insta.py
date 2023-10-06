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
    print(data);
    if 'developerKey' not in data:
        return jsonify({'error': 'Please provide a username in the request body'}), 400
    developerKey=data['developerKey']
    channelId=data['channelId']
    youtube = build('youtube', 'v3',
				developerKey=developerKey)
    ch_request = youtube.channels().list(
	part='snippet,statistics,contentDetails',
	id=channelId)
    ch_response = ch_request.execute()
    allUploadedVideosPlaylist =  ch_response["items"][0]['contentDetails']['relatedPlaylists']['uploads']
    videos = [ ]
    postCount=round(int(ch_response['items'][0]['statistics']['videoCount'])*0.1)
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

if __name__ == '__main__':
    app.run(debug=True, port=6061)
