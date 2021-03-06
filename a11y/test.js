window.addEventListener('load', () => {
    let absScroll = document.querySelector('.abs-scroll');
    let lastScrollTop = 0;
    let scrollPosition = 0;

    function updateItemPositions() {
        let child = absScroll.firstElementChild;
        let i = 0;
        while(child) {
            child.style.top = `${20 * i - scrollPosition + lastScrollTop}px`;
            child = child.nextElementSibling;
            i++;
        }
    }

    updateItemPositions();

    absScroll.addEventListener('scroll', (e) => {
        let scrollUp = e.target.scrollTop > lastScrollTop;
        scrollPosition += scrollUp ? 100 : -100;
        lastScrollTop = e.target.scrollTop;
        updateItemPositions();
    });

    let scene = document.querySelector('flt-scene');
    let report = document.querySelector('flt-report');
    let eventTypes = [
        'pointerdown',
        'pointermove',
        'pointerup',
        'pointercancel',
        'click',
        'scroll',
        'keypress',
    ];

    let eventTypeIcons = {
        'pointerdown': '&#8595;',
        'pointermove': '&#8660;',
        'pointerup': '&#8593;',
        'pointercancel': '&#215;',
        'click': '&#10003;',
        'scroll': '|',
        'keypress': 'k',
    };

    let eventTypeCategories = {
        'pointerdown': 'pointer',
        'pointermove': 'pointer',
        'pointerup': 'pointer',
        'pointercancel': 'pointer',
        'click': 'gesture',
        'scroll': 'gesture',
        'keypress': 'gesture',
    };

    let recording = [];
    let lastEventTimestamp = null;

    let listener = (event) => {
        event.timestamp = window.performance.now();
        let millisSinceLastEvent = 'first event';
        if (lastEventTimestamp) {
            millisSinceLastEvent = `${ event.timestamp - lastEventTimestamp }ms since last event`;
        }
        lastEventTimestamp = event.timestamp;
        let target = event.target;
        let targetName = target.tagName;
        if (target.id) {
            targetname = `${ target.tagName }#${ target.id }`;
        }
        console.log(`  > ${ event.type } on ${ targetName }; ${ millisSinceLastEvent }`);
        recording.push(event);
    };

    window.record = () => {
        lastEventTimestamp = null;
        console.log('Recording events');
        eventTypes.forEach((eventType) => {
            scene.addEventListener(eventType, listener);
        });
        document.querySelector('.scrollable').addEventListener('scroll', (e) => {
            console.log(`>>> scroll: ${e.target.scrollTop}`);
        });
        document.querySelector('.scrollable').addEventListener('pointermove', (e) => {
            console.log(`>>> pointermove inside scrollable`);
        });
    }

    function renderReport() {
        while(report.firstChild) {
            report.firstChild.remove();
        }

        let start = recording[0].timestamp;
        let end = recording[recording.length - 1].timestamp;
        let timeSpan = end - start + 40;
        let previusRightEdge = 0;
        let level = 0;

        for (let i = 0; i < recording.length; i++) {
            let event = recording[i]
            let timeOffset = event.timestamp - start;
            let timePercent = 100 * timeOffset / timeSpan;

            let eventElement = document.createElement('flt-event');
            eventElement.style.left = `${ timePercent }%`;
            let backgroundColor = eventTypeCategories[event.type] === 'pointer'
              ? '#007700'
              : '#4444FF';
            eventElement.style.backgroundColor = backgroundColor;
            eventElement.innerHTML = eventTypeIcons[event.type];
            report.append(eventElement);

            let clientRect = eventElement.getBoundingClientRect();
            let leftEdge = clientRect.left;
            let rightEdge = clientRect.right;
            if (leftEdge < previusRightEdge) {
                level += 1;
            } else {
                level = 0;
            }
            eventElement.style.top = `${ level * 20 }px`;
            previusRightEdge = rightEdge;
        }
    }

    window.stopRecording = () => {
        eventTypes.forEach((eventType) => {
            scene.removeEventListener(eventType, listener);
        });
        console.log(`Recorded ${ recording.length } events.`);
        renderReport();
        recording = [];
    };
});
