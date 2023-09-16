import instaloader
from flask import Flask, request, jsonify

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

if __name__ == '__main__':
    app.run(debug=True,port=6061)
