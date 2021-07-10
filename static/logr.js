class Logr {
  endpoint;
  events = [];
  constructor(endpoint = '/api/v1/tracking') {
    this.endpoint = endpoint;
    window.setInterval(() => this.submitEvents(), 10000);
    window.addEventListener('unload', () => {
      this.log('LEAVE_PAGE');
      this.submitEvents();
    });
  }
  submitEvents() {
    if (this.events.length) {
      const eventsToSubmit = [...this.events];
      this.events = [];
      navigator.sendBeacon(this.endpoint, JSON.stringify(eventsToSubmit));
    }
  }
  log(eventName, payload) {
    this.events.push({ ...payload, timestamp: new Date(), name: eventName });
  }
}
