let s = 25*60;
let timerIsRunning = false;

chrome.alarms.onAlarm.addListener((alarm) => {

    if(!timerIsRunning) {
        return;
    }

    s--;

    const min = Math.floor(s/60) + "M";
    chrome.action.setBadgeText(
        {
            text: min,
        },
        () => {}
    )

    if(s <= 0) {
        clearAlarm("pomodoro-timer");
        createNotification("Your Time has finished, take a break");
        chrome.contextMenus.update("start-timer", {
            title: "Start Timer",
            contexts: ["all"]
        });
        chrome.action.setBadgeText(
            {
                text: "-",
            },
            () => {}
        )
        chrome.action.setBadgeBackgroundColor(
            {color: "yellow"},
            () => {},
        );
    }
})

function createAlarm(name) {
    chrome.alarms.create(
        name,
        {
            periodInMinutes: 1 / 60
        }
    )
}

function  createNotification(message) {
    const opt = {
        type: "list",
        title: "Pomodoro Timer",
        message,
        items: [{ title: "Pomodoro Timer", message:message}],
        iconUrl: 'icons/time-8-48.png'
    };

    chrome.notifications.create(opt);
}

function clearAlarm(name) {
    chrome.alarms.clear(
        name,
        (wasCleared) => {
            console.log(wasCleared);
        }
    );
}

chrome.contextMenus.create({
    id: "start-timer",
    title: "Start Timer",
    contexts: ["all"]
})

chrome.contextMenus.create({
    id: "reset-timer",
    title: "Reset Timer",
    contexts: ["all"]
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "start-timer":
            if (timerIsRunning) {
                clearAlarm("pomodoro-timer");

                chrome.action.setBadgeText(
                    {
                        text: "S",
                    },
                    () => {}
                )
                chrome.action.setBadgeBackgroundColor(
                    {color: "blue"},
                    () => {},
                );

                createNotification("Your Timer has stopped");
                chrome.contextMenus.update("start-timer", {
                    title: "Start Timer",
                    contexts: ["all"]
                });
                timerIsRunning = false;
                return;
            }

            s = s <= 0 ? 25*60 : s;

            createNotification("Your Timer has started")
            timerIsRunning = true;
            createAlarm("pomodoro-timer");
            chrome.action.setBadgeBackgroundColor(
                {color: "red"},
                () => {},
            );
            chrome.contextMenus.update("start-timer", {
                title: "Stop Timer",
                contexts: ["all"]
            });
            break;

        case "reset-timer":
            chrome.contextMenus.update("start-timer", {
                title: "Start Timer",
                contexts: ["all"]
            });

            clearAlarm("pomodoro-timer");
            chrome.action.setBadgeText(
                {
                    text: "R",
                },
                () => {}
            )
            chrome.action.setBadgeBackgroundColor(
                {color: "green"},
                () => {},
            );

            createNotification("Your Timer has been reset");
            timerIsRunning = false;
            s=0;

            break;

        default:
            break;
    }
}); 

chrome.action.setBadgeBackgroundColor(
    {color: "red"},
    () => {},
);