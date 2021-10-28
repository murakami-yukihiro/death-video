export const cuteRobot = (audioBuffer: AudioBuffer) => {
  const channels = [];
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    channels[i] = new Float32Array(audioBuffer.getChannelData(i));
  }

  const inputChannels = channels;
  const { sampleRate } = audioBuffer;
  const chunkSeconds = 0.03;
  const chunkSize = chunkSeconds * sampleRate;

  const outputChannels = [];
  for (let i = 0; i < inputChannels.length; i++) {
    const input = inputChannels[i];

    // cut input at nodal points
    const chunks: number[][] = [];
    let currentChunk: number[] = [];
    for (let j = 0; j < input.length; j++) {
      if (currentChunk.length >= chunkSize) {
        chunks.push(currentChunk);
        currentChunk = [];
      }
      currentChunk.push(input[j]);
    }

    // play with chunks
    for (let j = 0; j < chunks.length; j++) {
      const dup = [...chunks[j]];
      chunks[j] = [...chunks[j], ...dup];
    }

    // join chunks
    const output = new Float32Array(chunks.reduce((a, v) => a + v.length, 0));
    let m = 0;
    for (let j = 0; j < chunks.length; j++) {
      for (let k = 0; k < chunks[j].length; k++) {
        output[m] = chunks[j][k];
        m += 1;
      }
    }

    // resample
    const resampledOutput = [];
    const desiredSamplesPerPoint = input.length / output.length;
    let numSamplesSoFar = 0;
    for (let j = 0; j < output.length; j++) {
      // If less than required sample ratio, grab another sample
      const numPointsSoFar = j + 1;
      if (numSamplesSoFar / numPointsSoFar < desiredSamplesPerPoint) {
        resampledOutput.push(output[j]);
        numSamplesSoFar += 1;
      }
    }

    outputChannels.push(Float32Array.from(resampledOutput));
  }
  const ctx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    outputChannels[0].length,
    audioBuffer.sampleRate
  );

  // eslint-disable-next-line no-param-reassign
  audioBuffer = ctx.createBuffer(
    outputChannels.length,
    outputChannels[0].length,
    audioBuffer.sampleRate
  );
  for (let i = 0; i < outputChannels.length; i++) {
    audioBuffer.copyToChannel(outputChannels[i], i);
  }

  return audioBuffer;
};
