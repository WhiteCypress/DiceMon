const log = (text, color = '') => {
  const parent = document.querySelector('#events');
  const el = document.createElement('li');
  el.innerHTML = text;
  el.style.color = color;

  parent.appendChild(el);
  parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';
  
  const username = document.querySelector('#username');
  const name = username.value;
  sock.emit('chat', name + ': ' + text);
};

const onJoinGameClicked = (sock, secret) => (e) => {
  e.preventDefault();
  
  const username = document.querySelector('#username');
  const name = username.value;
  sock.emit('joingame', name, secret);
};

const onLeaveGameClicked = (sock, secret) => (e) => {
  e.preventDefault();
  
  sock.emit('leavegame', (secret));
};

const onAddMonClicked = () => (e) => {
  e.preventDefault();

  const parent = document.querySelector('#mon-list');

  if(parent.childElementCount < 5) {
    const el = document.createElement('li');
    el.innerHTML = mon_html;
    
    parent.appendChild(el);
    parent.scrollTop = parent.scrollHeight;
  }

  if(parent.childElementCount == 5) {
    document
      .querySelector('#add-mon-button')
      .disabled = true;
  }
};

const onVerifyTeamClicked = () => (e) => {
  e.preventDefault();

  const parent = document.querySelector('#mon-list');
  var childrenArray = Array.from(parent.children);

  if (childrenArray.length == 0) {
    log('team is not legal because of team size.', 'red');
    return;
  }

  var mon_list = [];
  var total_hp = 0;
  var total_atk = 0;

  childrenArray.forEach((child) => {
    var newMon = new Mon();
    newMon.name = child.getElementsByClassName('name-input')[0].value;
    newMon.hp = parseInt(child.getElementsByClassName('hp-input')[0].value);
    newMon.atk = parseInt(child.getElementsByClassName('atk-input')[0].value);

    newMon.skills = [];

    newMon.skills.push(new Skill(
      parseInt(child.getElementsByClassName('pow-input')[0].value),
      parseInt(child.getElementsByClassName('cost-input')[0].value)
      ));
    newMon.skills.push(new Skill(
      parseInt(child.getElementsByClassName('pow-input')[1].value),
      parseInt(child.getElementsByClassName('cost-input')[1].value)
      ));
    newMon.skills.push(new Skill(
      parseInt(child.getElementsByClassName('pow-input')[2].value),
      parseInt(child.getElementsByClassName('cost-input')[2].value)
      ));
    newMon.skills.push(new Skill(
      parseInt(child.getElementsByClassName('pow-input')[3].value),
      parseInt(child.getElementsByClassName('cost-input')[3].value)
      ));

    if (newMon.verify()) {
      mon_list.push(newMon);
    } else {
      log(newMon.name + ' is not legal because of skill.', 'red');
      return;
    }

    total_hp += newMon.hp;
    total_atk += newMon.atk;
  });

  // TODO: do something with the mon_list
  if (total_hp > 200 || total_atk > 200) {
    log('team is not legal because of hp or atk.', 'red');
  } else {
    document
      .querySelector('#joingame')
      .disabled = false;

    log('Your team is valid.', 'green')
  }
};

(() => {
  log('welcome');
  const sock = io();
  var secret = -1;

  sock.on('chat', (text) => {
    log(text);
  })

  sock.on('secret', (s) => {
    secret = s;

    document
      .querySelector('#joingame')
      .addEventListener('click', onJoinGameClicked(sock, secret));

    document
      .querySelector('#leavegame')
      .addEventListener('click', onLeaveGameClicked(sock, secret));
  })

  sock.on('join-success', () => {
    document
      .querySelector('#leavegame')
      .disabled = false;

    document
      .querySelector('#joingame')
      .disabled = true;
  })

  sock.on('leave-success', () => {
    document
      .querySelector('#leavegame')
      .disabled = true;

    document
      .querySelector('#joingame')
      .disabled = false;
  })

  sock.on('update-player' , (players) => {
    var element = document
      .querySelector('#current-players');

    element.innerHTML = '';

    players.forEach(p => {
      const el = document.createElement('li');
      el.innerHTML = p;
      element.appendChild(el);
    });
  })

  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));

  document
    .querySelector('#add-mon-button')
    .addEventListener('click', onAddMonClicked());

  document
    .querySelector('#verify-team-button')
    .addEventListener('click', onVerifyTeamClicked());
})();
