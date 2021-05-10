# The Circle
A dating app which matches users based on their common friends.
Made with React-Native, Redux and Google's Firebase.

## Matching Demo 
<p align="middle">
 <blockquote class="imgur-embed-pub" lang="en" data-id="a/XF0NHvZ" data-context="false" ><a href="//imgur.com/a/XF0NHvZ"></a></blockquote>
 <script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>
 <img src="https://github.com/shaurya2612/TheCircle/blob/main/CircleMatching.gif" width=30% height=30%>
</p>

## How it works
1. The app makes temporary chatrooms based on **The friends of your friends**. In Circle your friends are called actually called **Permis**. And the friends of your friends are called **Temps**. The registration works through OTP verification of phone number and a password.

2. Once inside a chatroom both the people can talk anonymously and then decide whether they want to -
    1. Skip to the next temp.
    2. Like the current temp.
    3. Skip the current temp and turn matching off.
    
3. If both the temps in a chatroom like each other at the same time, they are shifted to each other matches, where their identity is revealed. Their previous chat persists

4. Users can turn their matching on or off at any time, making them available, or unavailable for chatrooms. As the app can match you with a person even when you're offline!






