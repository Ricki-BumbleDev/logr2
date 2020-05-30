class Logr {
  events = [];
  constructor() {
    window.setInterval(() => this.submitEvents(), 10000);
    window.addEventListener('unload', () => this.submitEvents(true));
  }
  submitEvents(unload) {
    if (unload) {
      this.log('LEAVE_PAGE');
    }
    if (this.events.length) {
      const eventsToSubmit = [...this.events];
      this.events = [];
      navigator.sendBeacon('/api/v1/tracking', JSON.stringify(eventsToSubmit));
    }
  }
  log(eventName, payload) {
    this.events.push({ ...payload, timestamp: new Date(), name: eventName });
  }
}
