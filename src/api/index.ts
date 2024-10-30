import request from '@/utils/request'

export async function createChannel(clientId: string): Promise<any> {
  return request.post('/add_channel', {
    event_id: clientId,
  })
}

export async function joinChannel(clientId: string, token: string, channel: string, uid: string): Promise<any> {
  return request.post('/join_channel', {
    event_id: clientId,
    token,
    channel,
    uid,
  })
}

export async function leaveChannel(clientId: string, token: string, channel: string): Promise<any> {
  return request.post('/del_channel', {
    event_id: clientId,
    token,
    channel,
  })
}

export async function stopChannel(clientId: string, token: string, channel: string): Promise<any> {
  return request.post('/stop_channel', {
    event_id: clientId,
    token,
    channel,
  })
}

export async function restartChannel(clientId: string, token: string, channel: string): Promise<any> {
  return request.post('/restart_channel', {
    event_id: clientId,
    token,
    channel,
  })
}
