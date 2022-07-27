<script>
  import { LOGONSERVER } from '$env/static/private'

  const details = {
    noc: 123,
    title: 'awesome title',
    description: ['job description', 'more description'],
    requirements: ['list', 'of', 'requirements'],
  }

  const noc = details.noc
  const group = details.title
  const job = details.title
  const requirements = details.requirements
  const descriptions = details.description

  const closeModal = () => {
    console.log('trying to close modal')
  }

  /**
   * Title case a given string.
   * @param {string} str
   */
  const titleCase = (str) => {
    return str
      .split(' ')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(' ')
  }
</script>

<div id="details-modal" class="modal" on:click={closeModal}>
  <div class="modal-content">
    <div class="modal-header">
      <span class="close" on:click={closeModal}>&times;</span>
      <h2>{titleCase(job)}</h2>
    </div>
    <div class="modal-body">
      <div class="group-details">
        <h3>
          NOC Group:
          <span v-if="group">{titleCase(group)}</span>
          <span v-else>Unknown</span>
        </h3>
        <h3>
          NOC Code: <span v-if="noc">{noc}</span><small v-else
            ><i>unknown</i></small
          >
        </h3>
      </div>
      <h4>Education Requirements</h4>
      <ul>
        {#each requirements as requirement}
          <li>
            {requirement}
          </li>
        {/each}
      </ul>
      <h4>Other Requirements</h4>
      <ul>
        {#each requirements as requirement}
          <li>
            {requirement}
          </li>
        {/each}
      </ul>
      <h4>Unit Group Job Description</h4>
      <ul>
        {#each descriptions as description}
          <li>
            {description}
          </li>
        {/each}
      </ul>
      <h4>Industry Outlook</h4>
      <p>Job forecasting and industry outlook features coming soon...</p>
    </div>
    <div class="modal-footer">
      <button class="btn" on:click={closeModal}>Close</button>
    </div>
  </div>
</div>

<style>
  .group-details {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0 0 0;
    font-weight: bold;
  }
  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0); /* fallback only */
    background-color: rgba(0, 0, 0, 0.4);
  }
  .modal-header {
    background-color: #f1f1f1;
    padding: 20px;
    font-size: 20px;
    text-align: center;
  }
  .modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    border-radius: 7px;
  }
  .close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    margin-top: -8px;
  }
  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
  .btn {
    background-color: #4caf50;
    color: white;
    font-weight: bold;
    padding: 14px 20px;
    margin: 8px 0 0 0;
    border: none;
    cursor: pointer;
    width: 100%;
    border-radius: 5px;
  }
  .btn:hover {
    background-color: #45a049;
  }
</style>
